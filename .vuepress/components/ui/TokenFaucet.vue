<template>
    <b-row>
        <b-col lg="12">
            <b-card header="Faucet" class="mb-3">
                <b-alert show variant="warning">
                    Faucet has moved.
                </b-alert>
                <p class="card-text">
                    <b-link href="https://app.friendsfingers.com/faucet/">
                        Go to Faucet
                    </b-link>
                </p>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
  import browser from '../../mixins/browser';

  import friends from '../../content/friends';

  export default {
    name: 'TokenFaucet',
    mixins: [
      browser
    ],
    data () {
      return {
        referral: {
          name: '',
          link: '',
          address: '',
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

      document.location.href = "https://app.friendsfingers.com/faucet/" + (this.referral.address ? `?referral=${this.referral.address}` : '');
    },
  };
</script>
