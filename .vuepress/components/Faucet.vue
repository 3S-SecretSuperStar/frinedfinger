<template>
    <b-row>
        <b-col lg="12">
            <b-card title="Faucet"
                    sub-title="Get FREE Shaka every day">
                <template v-if="loading">
                    <ui--loader :loading="true"></ui--loader>
                </template>
                <template v-else>
                    <p class="card-text">Remaining Tokens: <b>{{ faucet.remainingTokens }} {{ token.symbol }}</b></p>
                </template>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
  import browser from '../mixins/browser';
  import dapp from '../mixins/dapp';

  export default {
    name: 'Faucet',
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
          remainingTokens: 0,
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
