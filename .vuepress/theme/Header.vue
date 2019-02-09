<template>
    <b-navbar toggleable="md" variant="light" fixed="top" :sticky="true">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand to="/">
            <b-img :src="$withBase('/assets/images/logo/shaka.svg')"
                   rounded="circle"
                   height="24"
                   :alt="$site.title" />
            {{ $site.title }}
        </b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item :to="$withBase('/faucet.html')">Faucet</b-nav-item>
                <b-nav-item href="https://medium.com/friendsfingers" target="_blank">Blog</b-nav-item>
                <b-nav-item href="https://www.friendsfingers.com" target="_blank">FriendsFingers</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item href="https://etherscan.io/token/0x93a7174dafd31d13400cd9fa01f4e5b5baa00d39"
                            target="_blank">
                    <b-badge variant="info" class="p-1">View on Etherscan</b-badge>
                </b-nav-item>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
</template>

<script>
  export default {
    name: 'Header',
  };
</script>
