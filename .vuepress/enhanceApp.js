import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import { VueSpinners } from '@saeris/vue-spinners';

export default ({ Vue }) => {
  Vue.use(BootstrapVue);
  Vue.use(VeeValidate);
  Vue.use(VueSpinners);

  Vue.filter('formatLocaleDate', function (value) {
    if (!value) {
      return '';
    }

    return new Date(value).toLocaleString();
  });
};
