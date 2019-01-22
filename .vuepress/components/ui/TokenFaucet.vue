<template>
    <b-row>
        <b-col lg="12">
            <b-card title="Faucet"
                    sub-title="Get FREE Shaka every day">
                <template v-if="loading">
                    <ui--loader :loading="true"></ui--loader>
                </template>
                <template v-else>
                    <p class="card-text">
                        Distributed Tokens: <b>{{ faucet.distributedTokens }} {{ token.symbol }}</b><br>
                        Remaining Tokens: <b>{{ faucet.remainingTokens }} {{ token.symbol }}</b><br>
                        Account: <b>{{ account.address }}</b><br>
                        Referral: <b>{{ account.referral }}</b><br>
                        Received Tokens: <b>{{ account.receivedTokens }} {{ token.symbol }}</b><br>
                        Referred Addresses: <b>{{ account.referredAddresses }}</b><br>
                        Earned by Referral: <b>{{ account.earnedByReferral }} {{ token.symbol }}</b>
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
        token: {
          name: '',
          symbol: '',
        },
        faucet: {
          distributedTokens: 0,
          remainingTokens: 0,
        },
        account: {
          address: '',
          receivedTokens: 0,
          earnedByReferral: 0,
          referral: '',
          referredAddresses: [],
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
      ready () {
        this.getData();
      },
      async getData () {
        try {
          this.token.name = await this.promisify(this.instances.token.name);
          this.token.symbol = await this.promisify(this.instances.token.symbol);

          this.faucet.remainingTokens = parseFloat(
            this.web3.fromWei(await this.promisify(this.instances.faucet.remainingTokens))
          );
          this.faucet.distributedTokens = parseFloat(
            this.web3.fromWei(await this.promisify(this.instances.faucet.totalDistributedTokens))
          );

          if (!this.legacy) {
            await this.web3Provider.enable();
          }

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

          this.loading = false;
        } catch (e) {
          console.log(e);
          this.loading = false;
          alert('Some error occurred.');
        }
      },
    },
  };
</script>
