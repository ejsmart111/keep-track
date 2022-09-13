<template>
   <GoogleMap api-key="AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU" style="width: 100%; height: 300px" :center="event.location" :zoom="1">
    <Marker :options="{ position: event.location, label: event.title }" />
  </GoogleMap>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from "@vue/runtime-core";
import { EventModel } from "../types/Event";
import { GoogleMap, Marker } from "vue3-google-map";

export default defineComponent({
   props: {
      event: {
         type: Object as PropType<EventModel>,
         required: true
      }
   },
   components: {
      GoogleMap, Marker
   },
   setup(props) {

   }
})
</script>

<style scoped>
   #map {
      height: 100%;
      width: 100%;
   }
</style>
