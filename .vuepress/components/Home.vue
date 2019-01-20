<template>
    <b-row>
        <b-col lg="10" offset-lg="1">
            <b-jumbotron :header="$site.title" :lead="$site.description">
                <b-btn variant="info" size="lg" href="#">More Info</b-btn>
            </b-jumbotron>

            <faucet></faucet>
        </b-col>
    </b-row>
</template>

<script>
  import Faucet from './Faucet.vue';

  export default {
    name: 'Home',
    components: {
      Faucet,
    },
  };
</script>
