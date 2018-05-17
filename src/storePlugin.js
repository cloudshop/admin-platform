import store from './store/store'

export default {  
  store,
  // we can add objects to the Vue prototype in the install() hook:
  install (Vue, options) {
    Vue.prototype.$store = store
  }
}
