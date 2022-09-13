<template>
  <navbar/>
  <Calendar/>
</template>

<script lang="ts">
  import Navbar from './components/Navbar.vue';
  import Calendar from './components/Calendar.vue'
  import { defineComponent } from '@vue/runtime-core'

  export default defineComponent({
    components: {
      Navbar,
      Calendar
    }
  })
</script>

<style scoped>

</style>
