import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCQuYuYUmj41WBIgRnctOHPwoVGgxWx9Xc",
  authDomain: "scribeless-assessment.firebaseapp.com",
  databaseURL: "https://scribeless-assessment.firebaseio.com",
  projectId: "scribeless-assessment",
  storageBucket: "scribeless-assessment.appspot.com",
  messagingSenderId: "256709933809",
  appId: "1:256709933809:web:0235c1cf64f5e879044750"
};

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(() =>{
  if(!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
})
