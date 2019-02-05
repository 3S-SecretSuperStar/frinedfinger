<template>
    <div>
        <b-row class="masthead main m-0">
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
                <p class="lead mt-5">
                    <b-btn variant="primary" size="lg" :to="$withBase('/faucet.html')">Get FREE Shaka</b-btn>
                </p>
            </b-col>
        </b-row>
        <b-row class="masthead purple m-0">
            <b-col lg="8" offset-lg="2">
                <h1 class="display-4">
                    <b-img :src="$withBase('/assets/images/logo/friendsfingers_logotype_transparent.png')"
                           fluid
                           width="512"
                           alt="FriendsFingers" />
                </h1>
                <h4>Crowdfund your idea in a few steps</h4>
                <p class="lead">
                    Build your Ethereum based Crowdsale and start your ICO with
                    no setup costs and zero lines of code required.
                </p>
                <p class="lead mt-5">
                    <b-btn variant="action" size="lg" target="_blank" href="https://www.friendsfingers.com">
                        Discover more
                    </b-btn>
                </p>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  export default {
    name: 'Home',
  };
</script>
