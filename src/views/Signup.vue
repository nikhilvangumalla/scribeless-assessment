<template>
  <v-card>
    <v-card-title
      ><h1 class="display-1">
        Signup
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

        <v-btn class="mr-4" @click="signup" color="info" type="submit">
          Signup
        </v-btn>
      </v-form>
    </v-card-text>
    <v-snackbar v-model="successMessage" timeout="2000" top color="green">
      successfully signed up
    </v-snackbar>
    <v-snackbar v-model="errorMessage" timeout="2000" top color="green">
      failed to sign up please try with different mail id
    </v-snackbar>
  </v-card>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Signup",
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
    async signup() {
      if (this.$refs.form.validate()) {
        try {
          const res = await firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password);
          await firebase
            .firestore()
            .collection("users")
            .doc(res.user.uid)
            .set({ favorites: [] });
          this.successMessage = true;
          this.$router.replace({ name: "Home" });
        } catch (error) {
          this.errorMessage = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
