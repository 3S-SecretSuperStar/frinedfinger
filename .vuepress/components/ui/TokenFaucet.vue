<template>
    <b-row>
        <b-col lg="12">
            <b-card title="Faucet"
                    :sub-title="$page.title">
                <template v-if="loading">
                    <ui--loader :loading="true"></ui--loader>
                </template>
                <template v-else>
                    <p class="card-text">
                        Distributed Tokens: <b>{{ faucet.distributedTokens }} {{ token.symbol }}</b><br>
                        Remaining Tokens: <b>{{ faucet.remainingTokens }} {{ token.symbol }}</b><br>
                        Daily Rate: <b>{{ faucet.dailyRate }} {{ token.symbol }}</b><br>
                        Referral Tokens: <b>{{ faucet.referralTokens }} {{ token.symbol }}</b>
                    </p>
                </template>
            </b-card>
            <b-card v-if="!loading" title="Your account"
                    sub-title="Connect your account and start earning your Shaka Tokens"
                    class="mt-3">
                <template v-if="metamask.address">
                    <p class="card-text">
                        Account: <b>{{ account.address }}</b><br>
                        Referral: <b>{{ account.referral === zeroAddress ? 'None' : account.referral }}</b><br>
                        Received Tokens: <b>{{ account.receivedTokens }} {{ token.symbol }}</b><br>
                        Referred Addresses: <b>{{ account.referredAddresses.length }}</b><br>
                        Earned by Referral: <b>{{ account.earnedByReferral }} {{ token.symbol }}</b><br>
                        <template v-if="account.lastUpdate !== 0">
                            Last Update: <b>{{ account.lastUpdate | formatLocaleDate }}</b><br>
                            Next Claim Date: <b>{{ account.nextClaimTime | formatLocaleDate }}</b><br>
                        </template>
                    </p>
                    <b-form v-on:submit.prevent="getTokens" class="mt-3" v-if="!makingTransaction">
                        <b-form-group id="referral-group"
                                      label="Referral Address:"
                                      label-for="referral"
                                      v-if="account.receivedTokens === 0"
                                      description="Your referral address">
                            <b-form-input id="referral"
                                          name="referral"
                                          type="text"
                                          size="lg"
                                          v-validate="'not_yourself|eth_address'"
                                          data-vv-as="Referral Address"
                                          :class="{'is-invalid': errors.has('referral')}"
                                          placeholder="0x12312312...">
                            </b-form-input>
                            <small v-show="errors.has('referral')" class="text-danger">
                                {{ errors.first('referral') }}
                            </small>
                        </b-form-group>

                        <b-btn type="submit"
                               variant="primary"
                               :disabled="errors.has('referral')"
                               size="lg">
                            Get Tokens
                        </b-btn>
                    </b-form>
                </template>
                <template v-else>
                    <b-alert show v-if="!metamask.installed || metamask.netId !== network.current.id" variant="warning">
                        <template v-if="!metamask.installed">
                            Install
                            <b-link href="https://metamask.io/" target="_blank">MetaMask</b-link>
                            to get your Tokens.
                        </template>
                        <template v-else-if="metamask.netId !== network.current.id">
                            You are on the wrong Network.<br>
                            Please switch MetaMask on <b>{{ network.current.name }}</b>.
                        </template>
                    </b-alert>
                    <p class="card-text">
                        <b-btn variant="primary"
                               size="lg"
                               :disabled="!metamask.installed || metamask.netId !== network.current.id"
                               @click="enable">
                            Connect
                        </b-btn>
                    </p>
                </template>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
  import browser from '../../mixins/browser';
  import dapp from '../../mixins/dapp';

  export default {
    name: 'TokenFaucet',
    mixins: [
      browser,
      dapp,
    ],
    data () {
      return {
        loading: true,
        makingTransaction: false,
        token: {
          name: '',
          symbol: '',
        },
        faucet: {
          dailyRate: 0,
          referralTokens: 0,
          distributedTokens: 0,
          remainingTokens: 0,
        },
        account: {
          address: '',
          receivedTokens: 0,
          earnedByReferral: 0,
          referral: '',
          referredAddresses: [],
          lastUpdate: 0,
          nextClaimTime: 0,
        },
      };
    },
    computed: {},
    async mounted () {
      this.currentNetwork = this.network.default;
      await this.initDapp();
    },
    methods: {
      async initDapp () {
        this.network.current = this.network.list[this.currentNetwork];
        try {
          await this.initWeb3(this.currentNetwork, true);
          this.initContracts();
        } catch (e) {
          alert(e);
          document.location.href = this.$withBase('/');
        }
      },
      async ready () {
        await this.getTokenData();
        await this.getFaucetData();
        await this.getAccountData();

        this.$validator.extend('eth_address', {
          getMessage: field => 'Insert a valid Ethereum address.',
          validate: value => this.web3.isAddress(value),
        });

        this.$validator.extend('not_yourself', {
          getMessage: field => 'You can\'t refer yourself.',
          validate: value => value.toLowerCase() !== this.metamask.address.toLowerCase(),
        });

        this.loading = false;
      },
      async enable () {
        await this.connect();
        await this.getAccountData();
      },
      async getTokenData () {
        try {
          this.token.name = await this.promisify(this.instances.token.name);
          this.token.symbol = await this.promisify(this.instances.token.symbol);
        } catch (e) {
          console.log(e);
          this.loading = false;
          alert('Some error occurred.');
        }
      },
      async getFaucetData () {
        try {
          this.faucet.dailyRate = parseFloat(
            this.web3.fromWei(await this.promisify(this.instances.faucet.dailyRate))
          );
          this.faucet.referralTokens = parseFloat(
            this.web3.fromWei(await this.promisify(this.instances.faucet.referralTokens))
          );
          this.faucet.remainingTokens = parseFloat(
            this.web3.fromWei(await this.promisify(this.instances.faucet.remainingTokens))
          );
          this.faucet.distributedTokens = parseFloat(
            this.web3.fromWei(await this.promisify(this.instances.faucet.totalDistributedTokens))
          );
        } catch (e) {
          console.log(e);
          this.loading = false;
          alert('Some error occurred.');
        }
      },
      async getAccountData () {
        try {
          if (this.metamask.address) {
            this.account.address = this.web3.eth.accounts[0];
            this.account.referral = await this.promisify(this.instances.faucet.getReferral, this.account.address);
            this.account.referredAddresses = await this.promisify(
              this.instances.faucet.getReferredAddresses, this.account.address
            );
            this.account.receivedTokens = parseFloat(
              this.web3.fromWei(await this.promisify(this.instances.faucet.receivedTokens, this.account.address))
            );
            this.account.earnedByReferral = parseFloat(
              this.web3.fromWei(await this.promisify(this.instances.faucet.earnedByReferral, this.account.address))
            );
            this.account.lastUpdate = (
              await this.promisify(this.instances.faucet.lastUpdate, this.account.address)
            ).valueOf() * 1000;
            this.account.nextClaimTime = (
              await this.promisify(this.instances.faucet.nextClaimTime, this.account.address)
            ).valueOf() * 1000;
          }
        } catch (e) {
          console.log(e);
          this.loading = false;
          alert('Some error occurred.');
        }
      },
      getTokens () {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            alert('TODO');
          }
        }).catch ((e) => {
          console.log(e);
          this.loading = false;
          alert('Some error occurred.');
        });
      },
    },
  };
</script>
