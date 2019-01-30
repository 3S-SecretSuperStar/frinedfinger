import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import { VueSpinners } from '@saeris/vue-spinners';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTelegramPlane, faMediumM, faTwitter, faFacebookF, faLinkedinIn, faEthereum, faGithub } from '@fortawesome/free-brands-svg-icons'; // eslint-disable-line max-len
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTelegramPlane);
library.add(faMediumM);
library.add(faTwitter);
library.add(faFacebookF);
library.add(faLinkedinIn);
library.add(faEthereum);
library.add(faGithub);

export default ({ Vue }) => {
  Vue.use(BootstrapVue);
  Vue.use(VeeValidate);
  Vue.use(VueSpinners);
  Vue.component('font-awesome-icon', FontAwesomeIcon);

  Vue.filter('formatLocaleDate', function (value) {
    if (!value) {
      return '';
    }

    return new Date(value).toLocaleString();
  });
};
