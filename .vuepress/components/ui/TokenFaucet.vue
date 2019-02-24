<template>
    <b-row>
        <b-col lg="12">
            <b-card v-if="!loading"
                    header="Your account"
                    class="mb-3">
                <template v-if="metamask.address">
                    <template v-if="!makingTransaction && !loadingData">
                        <b>Account:</b>
                        <b-link :href="`${network.current.etherscanLink}/address/${account.address}`"
                                target="_blank">{{ account.address }}</b-link><br>

                        <template v-if="account.referral !== zeroAddress">
                            <b>You have been invited by:</b>
                            <b-link :href="`${network.current.etherscanLink}/address/${account.referral}`"
                                    target="_blank">{{ account.referral }}</b-link><br>
                        </template>

                        You have earned <b>{{ account.receivedTokens }} {{ token.symbol }}</b> by using faucet.<br>

                        <template v-if="account.referredAddresses.length > 0">
                            You have earned <b>{{ account.earnedByReferral }} {{ token.symbol }}</b>
                            from your <b>{{ account.referredAddresses.length }}</b> referred addresses.<br>
                        </template>

                        <template v-if="account.lastUpdate !== 0">
                            <small>
                                Last Update: <b>{{ account.lastUpdate | formatLocaleDate }}</b>,
                                you can claim again on <b>{{ account.nextClaimTime | formatLocaleDate }}</b>
                            </small>
                        </template>

                        <template v-if="referral.link && account.receivedTokens === 0">
                            <br>
                            <h5>
                                Your referral:
                                <b-link :href="referral.link" target="_blank">{{ referral.name }}</b-link>
                            </h5>
                        </template>

                        <b-form v-on:submit.prevent="getTokens" class="mt-3" v-if="!makingTransaction">
                            <b-form-group id="referral-group"
                                          label="Referral Address:"
                                          label-for="referral"
                                          v-if="account.receivedTokens === 0 && referral.address !== ''"
                                          description="Your referral address">
                                <b-form-input id="referral"
                                              name="referral"
                                              type="text"
                                              size="lg"
                                              v-validate="'not_yourself|eth_address'"
                                              v-model="referral.address"
                                              readonly
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
                                   :disabled="errors.has('referral') || account.nextClaimTime > Date.now()"
                                   size="lg">
                                Get Tokens
                            </b-btn>

                            <b-alert show v-if="trx.hash" variant="success" class="mt-3">
                                Last transaction: <b-link :href="trx.link" target="_blank">{{ trx.hash }}</b-link>.
                            </b-alert>
                        </b-form>
                        <hr class="my-4">
                        <h4>Earn more Shaka Tokens with your referral link</h4>
                        <b-form-group id="my-link-group"
                                      label="Your referral link is:"
                                      label-for="my-link">
                            <b-form-input id="my-link"
                                          name="my-link"
                                          type="text"
                                          size="lg"
                                          readonly
                                          v-model="account.share.link">
                            </b-form-input>
                        </b-form-group>
                        <p class="share-link">
                            <b-btn :href="account.share.twitter" target="_blank" class="twitter">
                                <font-awesome-icon :icon="['fab', 'twitter']" />
                            </b-btn>
                            <b-btn :href="account.share.facebook" target="_blank" class="facebook">
                                <font-awesome-icon :icon="['fab', 'facebook-f']" />
                            </b-btn>
                            <b-btn :href="account.share.telegram" target="_blank" class="telegram">
                                <font-awesome-icon :icon="['fab', 'telegram-plane']" />
                            </b-btn>
                            <b-btn v-if="isMobile()" :href="account.share.whatsapp" target="_blank" class="whatsapp">
                                <font-awesome-icon :icon="['fab', 'whatsapp']" />
                            </b-btn>
                        </p>
                        <p class="lead">
                            Share with your friends and earn Shaka Tokens
                        </p>
                    </template>
                    <template v-else>
                        <ui--loader :loading="true"></ui--loader>
                    </template>
                </template>
                <template v-else>
                    <b-alert show v-if="!metamask.installed || metamask.netId !== network.current.id" variant="warning">
                        <template v-if="!metamask.installed">
                            Install
                            <b-link href="https://metamask.io/" target="_blank">MetaMask</b-link>
                            or a mobile browser like
                            <b-link href="https://trustwallet.com/" target="_blank">Trust Wallet</b-link> or
                            <b-link href="https://wallet.coinbase.com/" target="_blank">Coinbase Wallet</b-link>
                            to get your Tokens.
                        </template>
                        <template v-else-if="metamask.netId !== network.current.id">
                            You are on the wrong Network.<br>
                            Please switch your Ethereum Provider on <b>{{ network.current.name }}</b>.
                        </template>
                    </b-alert>
                    <p v-else class="card-text">
                        <b-btn variant="primary"
                               size="lg"
                               :disabled="!metamask.installed || metamask.netId !== network.current.id"
                               @click="enable">
                            Connect
                        </b-btn>
                    </p>
                </template>
            </b-card>
            <b-card title="Faucet status"
                    id="faucet-box"
                    class="mb-3 text-white">
                <template v-if="loading">
                    <ui--loader :loading="true" color="#ffffff"></ui--loader>
                </template>
                <template v-else>
                    <p class="card-text">
                        We've already distributed <b>{{ faucet.distributedTokens }} {{ token.symbol }}</b>.
                        Remaining tokens <b>{{ faucet.remainingTokens }} {{ token.symbol }}</b>.<br>

                        <b-progress :value="faucet.percentage"
                                    variant="warning"
                                    striped
                                    :animated="true"
                                    class="mt-2" />

                        <small>
                            You can earn <b>{{ faucet.dailyRate }} {{ token.symbol }}</b> per day and
                            <b>{{ faucet.referralTokens }} {{ token.symbol }}</b>
                            for each time your friends will use the faucet.
                        </small>
                    </p>
                </template>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
  import browser from '../../mixins/browser';
  import dapp from '../../mixins/dapp';

  import friends from '../../content/friends';

  export default {
    name: 'TokenFaucet',
    mixins: [
      browser,
      dapp,
    ],
    data () {
      return {
        loading: true,
        loadingData: false,
        makingTransaction: false,
        referralAddress: '',
        trx: {
          hash: '',
          link: '',
        },
        referral: {
          name: '',
          link: '',
          address: '',
        },
        token: {
          name: '',
          symbol: '',
          decimals: 18,
          link: '',
          logo: '',
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
          share: {
            link: '',
          },
        },
      };
    },
    computed: {},
    async mounted () {
      const referral = friends[this.getParam('friend')];

      if (referral) {
        this.referral = referral;
      } else {
        this.referral.address = this.getParam('referral') || '';
      }

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
          this.token.link = this.network.current.etherscanLink + '/token/' + this.instances.token.address;
          this.token.logo = this.$withBase('/assets/images/logo/shaka_logo_white.png');
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

          this.faucet.max = this.faucet.distributedTokens + this.faucet.remainingTokens;

          this.faucet.percentage = 100 * this.faucet.distributedTokens / this.faucet.max;
        } catch (e) {
          console.log(e);
          this.loading = false;
          alert('Some error occurred.');
        }
      },
      async getAccountData () {
        this.loadingData = true;
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

            this.account.share.link = window.location.origin + this.$withBase(
              `/faucet.html?referral=${this.account.address}`
            );

            this.account.share.facebook = `https://www.facebook.com/sharer.php?u=${this.account.share.link}&quote=Earn FREE Shaka, the token that will make you part of the FriendsFingers DAO`; // eslint-disable-line max-len
            this.account.share.twitter = `https://twitter.com/intent/tweet?url=${this.account.share.link}&hashtags=ethereum,blockchain,erc20,airdrop&text=Earn FREE Shaka, the token that will make you part of the @friendsfingers DAO`; // eslint-disable-line max-len
            this.account.share.telegram = `https://t.me/share/url?url=${this.account.share.link}&text=Earn FREE Shaka, the token that will make you part of the @friendsfingers DAO`; // eslint-disable-line max-len
            this.account.share.whatsapp = `whatsapp://send?text=Earn FREE Shaka, the token that will make you part of the FriendsFingers DAO ${this.account.share.link}`; // eslint-disable-line max-len
          }
          this.loadingData = false;
        } catch (e) {
          console.log(e);
          this.loadingData = false;
          alert('Some error occurred.');
        }
      },
      getTokens () {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            this.makingTransaction = true;

            this.instances.faucet.getTokensWithReferral(
              this.referral.address,
              {
                from: this.account.address,
              },
              (err, trxHash) => {
                if (!err) {
                  this.trx.hash = trxHash;
                  this.trx.link = this.network.current.etherscanLink + '/tx/' + this.trx.hash;
                } else {
                  alert('Some error occurred. Maybe you rejected the transaction or you have MetaMask locked!');
                }
                this.makingTransaction = false;
              }
            );
          }
        }).catch((e) => {
          console.log(e);
          this.makingTransaction = false;
          alert('Some error occurred.');
        });
      },
    },
  };
</script>
