<template>
  <v-card>
    <v-card-title
      ><h1 class="display-1">
        Login
      </h1></v-card-title
    >
    <v-card-text>
      <v-form @submit.prevent ref="form">
        <v-text-field
          v-model="email"
          label="E-mail"
          type="email"
          :rules="emailRules"
          required
          outlined
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          required
          outlined
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :rules="passwordRules"
        ></v-text-field>

        <v-btn class="mr-4" @click="login" color="info" type="submit">
          Login
        </v-btn>
        Not a user please
        <router-link to="/signup">
          Signup
        </router-link>
      </v-form>
    </v-card-text>
    <v-snackbar v-model="successMessage" timeout="2000" top color="green">
      successfully logged in
    </v-snackbar>
    <v-snackbar v-model="errorMessage" timeout="2000" top color="red">
      No user found with the given details
    </v-snackbar>
  </v-card>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      emailRules: [
        (value) => !!value || "Email is required",
        (value) => /.+@.+\...+/.test(value) || "E-mail must be valid",
      ],
      passwordRules: [
        (value) => !!value || "Password is required",
        (value) =>
          value.length > 6 || "Password should be greater than 6 characters",
      ],
      successMessage: false,
      errorMessage: false,
    };
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const res = await firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password);
          if (res.user) {
            this.successMessage = true;
            this.$router.replace({ name: "Home" });
          } else {
            this.errorMessage = true;
          }
        } catch (error) {
          this.errorMessage = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
