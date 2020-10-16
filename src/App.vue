<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <v-btn text to="/">
          NASA API
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="isLoggedIn">
        <v-btn text to="/myfavorites">
          My Favorites
        </v-btn>
        <v-btn text @click="signout">
          Logout
        </v-btn>
      </div>
      <div v-else>
        <v-btn text to="login">
          Login
        </v-btn>
        <v-btn text to="signup">
          Signup
        </v-btn>
      </div>
      <v-snackbar v-model="successMessage" timeout="2000" top color="green">
        successfully logged out
      </v-snackbar>
      <v-snackbar v-model="errorMessage" timeout="2000" top color="red">
        failed logged out
      </v-snackbar>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "App",
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.isLoggedIn = !!user;
    });
  },
  data: () => ({
    isLoggedIn: false,
    successMessage: false,
    errorMessage: false,
  }),
  methods: {
    async signout() {
      try {
        await firebase.auth().signOut();
        this.successMessage = true;

        this.$router.replace({ name: "Home" });
      } catch (error) {
        this.errorMessage = true;
      }
    },
  },
};
</script>
