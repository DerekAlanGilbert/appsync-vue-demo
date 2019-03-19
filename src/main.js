import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// vue-form-generator will make it easy to add and validate a styled form
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg-core.css'

// vue-apollo makes it easier for your vue app to interact with the apollo-client
// inside the aws-appsync package, which, in turn, coordinates the data exchanges
// between the front end store and the backend store and deals with caching etc.
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'


const config = {
  url: 'https://nd7io73igvbt7l2ii73fti346i.appsync-api.us-east-2.amazonaws.com/graphql',
  region: 'us-east-1',
  auth: {
   type: 'API_KEY',
   apiKey: 'da2-vfxegqtt2ff3zl7d6re2ul7qyq'
  },
  disableOffline: true // this was added to stop an issue with duplicated list items
 }
 
 // The default fetchPolicy is cache-first. This means that if data
// is returned from the cache, no network request will be sent. If
// a new item is in a list, this will not be realised. So here we change
// the policy so that network requests are always sent after data is returned
// from the cache.
const options = {
  defaultOptions: {
   watchQuery: {
     fetchPolicy: 'cache-and-network'
   }
  }
 }
 
const client = new AWSAppSyncClient(config, options)
const appsyncProvider = new VueApollo({
 defaultClient: client
})

Vue.use(VueFormGenerator)
Vue.use(VueApollo)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider: appsyncProvider,
  render: h => h(App)
}).$mount('#app')
