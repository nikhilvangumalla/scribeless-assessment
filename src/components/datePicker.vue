<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="date"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          label="pick a range of dates"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        no-title
        scrollable
        range
        :min="minDate"
        :max="maxDate"
        v-on:change="onChange"
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false">
          Cancel
        </v-btn>
        <v-btn text color="primary" @click="$refs.menu.save(date)">
          OK
        </v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
  }),
  computed: {
    minDate() {
      return moment().format("YYYY-MM-DD");
    },
    maxDate() {
      return moment(moment().add(7, "days")).format("YYYY-MM-DD");
    },
  },
  methods: {
    onChange() {
      this.$emit("date-changed", this.date);
    },
  },
};
</script>

<style lang="scss" scoped></style>
