import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import { store } from './store/store';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueScrollTo from 'vue-scrollto';
 
Vue.use(VueScrollTo, {
   container: '#conversation',
   duration: 500,
   easing: 'ease',
   offset: 0,
   cancelable: true,
   onStart: false,
   onDone: false,
   onCancel: false,
   x: false,
   y: true
 })

new Vue({
	store: store,
  el: '#chat-app-container',
  render: h => h(App)
});