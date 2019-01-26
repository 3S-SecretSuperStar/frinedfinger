<template>
    <b-row class="masthead m-0">
        <b-col lg="8" offset-lg="2">
            <h1 class="display-4">
                <b-img :src="$withBase('/assets/images/logo/shaka_logo_white.png')"
                       rounded="circle"
                       height="64"
                       :alt="$site.title" /><br>
                {{ $site.title }}
            </h1>
            <h4 class="text-muted">{{ $page.title }}</h4>
            <p class="lead">{{ $site.description }}</p>
            <hr class="my-5">
            <p class="lead">
                <b-btn variant="primary" size="lg" :to="$withBase('/faucet.html')">Get FREE Shaka</b-btn>
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
