<template>
  <div>
    <DatePicker @date-changed="getDataWithDates" />
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
        <template #[`item.nasaUrl`]="{item}">
          <a :href="item.nasaUrl">
            {{ item.nasaUrl }}
          </a>
        </template>
        <template #[`item.actions`]="{item}">
          <v-btn
            @click="makeFavorite(item)"
            color="primary"
            :disabled="userFavorites.includes(item.id)"
          >
            Favorite
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="successMessage" timeout="2000" top color="green">
      successfully added to myfavorites
    </v-snackbar>
    <v-snackbar v-model="errorMessage" timeout="2000" top color="red">
      failed to make favorite
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import DatePicker from "./../components/datePicker";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export default {
  components: {
    DatePicker,
  },
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
      successMessage: false,
      errorMessage: false,
      userFavorites: [],
    };
  },
  async created() {
    const isAuthenticated = firebase.auth().currentUser;
    if (isAuthenticated) {
      const doc = await firebase
        .firestore()
        .collection("users")
        .doc(isAuthenticated.uid)
        .get();
      if (doc.exists) {
        doc
          .data()
          .favorites.forEach((item) => this.userFavorites.push(item.id));
      }
    }
    const res = await axios.get(
      "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=gbnfKsPMBR1FY9ZTWfUADUwb3vZZFzRZ2b9T9GeQ"
    );
    const data = res.data.near_earth_objects.map((obj) => {
      return {
        id: obj.id,
        name: obj.name,
        magnitude: obj.absolute_magnitude_h,
        nasaUrl: obj.nasa_jpl_url,
      };
    });
    this.nasadata = data;
    this.loading = false;
  },
  methods: {
    async getDataWithDates(dates) {
      this.loading = true;
      const res = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dates[0]}&end_date=${dates[1]}&api_key=gbnfKsPMBR1FY9ZTWfUADUwb3vZZFzRZ2b9T9GeQ`
      );
      const data = [];
      const dateKeys = Object.keys(res.data.near_earth_objects);
      dateKeys.forEach((date) => {
        res.data.near_earth_objects[date].map((day) => {
          data.push({
            id: day.id,
            name: day.name,
            magnitude: day.absolute_magnitude_h,
            nasaUrl: day.nasa_jpl_url,
          });
        });
      });
      this.nasadata = data;
      this.loading = false;
    },
    async makeFavorite(item) {
      try {
        const isAuthenticated = firebase.auth().currentUser;
        if (!isAuthenticated) {
          this.$router.replace({ name: "Login" });
        } else {
          const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
          await firebase
            .firestore()
            .collection("users")
            .doc(isAuthenticated.uid)
            .update({ favorites: arrayUnion(item) });
          this.userFavorites.push(item.id);
          this.successMessage = true;
        }
      } catch (error) {
        this.errorMessage = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
