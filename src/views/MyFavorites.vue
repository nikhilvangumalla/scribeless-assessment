<template>
  <div>
    <v-card>
      <v-card-title>
        NASA API DATA
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="nasadata"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
      >
        <template #[`item.actions`]="{item}">
          <v-btn @click="deleteFavorite(item)" color="primary">
            Un Favorite
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Name", value: "name" },
        { text: "Magnitude", value: "magnitude" },
        { text: "NASA URL", value: "nasaUrl" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      nasadata: [],
      loading: true,
    };
  },
  async created() {
    await this.getFavorites();
  },
  methods: {
    async deleteFavorite(item) {
      const isAuthenticated = firebase.auth().currentUser;
      const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
      await firebase
        .firestore()
        .collection("users")
        .doc(isAuthenticated.uid)
        .update({
          favorites: arrayRemove(item),
        });
      await this.getFavorites();
    },
    async getFavorites() {
      const isAuthenticated = firebase.auth().currentUser;
      const doc = await firebase
        .firestore()
        .collection("users")
        .doc(isAuthenticated.uid)
        .get();
      let data = [];
      if (doc.exists) {
        data = doc.data().favorites;
      }
      this.nasadata = data;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
