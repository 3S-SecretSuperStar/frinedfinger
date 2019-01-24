<template>
    <div>
        <b-row class="masthead m-0">
            <b-col lg="8" offset-lg="2">
                <h1 class="display-4">
                    <b-img :src="$withBase('/assets/images/logo/shaka_logo_white.png')"
                           rounded="circle"
                           height="64"
                           :alt="$site.title" /><br>
                    Shaka Faucet
                </h1>
                <h4>{{ $page.title }}</h4>
                <p class="lead">{{ $page.frontmatter.description }}</p>
                <hr class="my-4">
                <p class="lead">
                    <b-btn variant="primary" size="lg" href="#faucet">Get your Shaka</b-btn>
                </p>
            </b-col>
        </b-row>
        <b-container id="faucet" class="mt-5">
            <b-row>
                <b-col lg="10" offset-lg="1">
                    <ui--token-faucet></ui--token-faucet>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
  export default {
    name: 'Faucet',
  };
</script>
