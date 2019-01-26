module.exports = {
  title: 'Shaka',
  description: 'Shaka (HAK) is an ERC20 Token issued by FriendsFingers and that will give holders rights to be active part of the platform like in a Decentralized Autonomous Organization (DAO).', // eslint-disable-line max-len
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'google-site-verification', content: 'c0BYczxXdBqyQL7I53N_77M_GcsNQIK9IHvjoAeMbW4' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Shaka (HAK) | The Token for a new way crowdfunding' }],
    ['meta', { property: 'og:url', content: 'https://shaka.friendsfingers.com' }],
    ['meta', { property: 'og:image', content: 'https://shaka.friendsfingers.com/assets/images/shaka-cover-rect.png' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: 'https://shaka.friendsfingers.com/assets/images/shaka-cover-rect.png' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:title', content: 'Shaka (HAK) | The Token for a new way crowdfunding' }],
    ['script', { src: '/assets/js/web3.min.js' }],
  ],
  ga: 'UA-111269229-4',
  chainWebpack: (config) => {
    const isProd = process.env.NODE_ENV && process.env.NODE_ENV === 'production';

    config.plugin('injections').tap(pluginArgs => pluginArgs.map(definitions => ({
      ...definitions,
      '__TOKEN_ADDRESS__': JSON.stringify(isProd ? '0x93a7174dafd31d13400cd9fa01f4e5b5baa00d39' : '0xe58cade1d92e5f5ce8b1bb4489c2196f832d5807'), // eslint-disable-line max-len
      '__FAUCET_ADDESS__': JSON.stringify(isProd ? '0x87d9EF8951DE64b7246fdb7c7D5a52760677f361' : '0x7B8d7dae72D9AF3A0E17Aa188b84EF33ff109316'), // eslint-disable-line max-len
      '__DEFAULT_NETWORK__': JSON.stringify(isProd ? 'mainnet' : 'rinkeby'),
      '__DEFAULT_NETWORK_NAME__': JSON.stringify(isProd ? 'Main Ethereum Network' : 'Rinkeby Test Network'),
    })));
  },
};
