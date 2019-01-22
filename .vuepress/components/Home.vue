<template>
    <b-row class="masthead m-0">
        <b-col lg="8" offset-lg="2" class="">
            <h1 class="display-4">
                <b-img :src="$withBase('/assets/images/logo/shaka_logo_white.png')"
                       rounded="circle"
                       height="64"
                       :alt="$site.title" /><br>
                {{ $site.title }}
            </h1>
            <p class="lead">{{ $site.description }}</p>
            <hr class="my-4">
            <p class="lead">
                <b-btn variant="primary" size="lg" href="#">More Info</b-btn>
            </p>
        </b-col>
    </b-row>
</template>

<script>
  import Faucet from './ui/TokenFaucet.vue';

  export default {
    name: 'Home',
    components: {
      Faucet,
    },
  };
</script>
