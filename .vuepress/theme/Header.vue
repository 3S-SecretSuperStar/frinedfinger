<template>
    <b-navbar toggleable="md" variant="light" fixed="top">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand to="/">
            <b-img :src="$withBase('/assets/images/logo/shaka_logo_white.png')"
                   rounded="circle"
                   height="24"
                   :alt="$site.title" />
            {{ $site.title }}
        </b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item to="#">About</b-nav-item>
                <b-nav-item to="/faucet.html">Faucet</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item disabled><b-badge variant="info" class="p-1">{{ currentNetwork }}</b-badge></b-nav-item>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
</template>

<script>
  /* global __DEFAULT_NETWORK_NAME__ */

  export default {
    name: 'Header',
    data () {
      return {
        currentNetwork: __DEFAULT_NETWORK_NAME__,
      };
    },
  };
</script>
