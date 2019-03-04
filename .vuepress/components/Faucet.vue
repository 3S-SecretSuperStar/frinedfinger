<template>
    <b-container>
        <b-row class="masthead m-0">
            <b-col lg="8" offset-lg="2">
                <h1 class="display-4">
                    <b-img :src="$withBase('/assets/images/logo/shaka_logo_white.png')"
                           rounded="circle"
                           height="64"
                           :alt="$site.title" /><br>
                    Shaka Faucet
                </h1>
                <h4 class="text-muted">{{ $page.frontmatter.description }}</h4>
            </b-col>
        </b-row>
        <b-row class="mt-4">
            <b-col lg="10" offset-lg="1">
                <ui--token-faucet></ui--token-faucet>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
  export default {
    name: 'Faucet',
  };
</script>
