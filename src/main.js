import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'

new Vue({
	store: store,
  el: '#chat-app-container',
  render: h => h(App)
})