<template>
   <nav class="navbar">
      <div class="container-nav">
         <div class="flex-bar">
            <img alt="logo" src="https://img.icons8.com/3d-fluency/100/000000/calendar--v2.png" class="image" />
            <h3 class="name">Keep Track</h3>
         </div>
         <img class="image vue" src="https://cdn.freebiesupply.com/logos/large/2x/vue-9-logo-png-transparent.png" alt="vue" />
      </div>
   </nav>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({

})
</script>

<style scoped>
   .navbar {
      background: #1F2938;
      height: 60px;
      padding: 10px;
      width: 100%;
   }

   .container-nav {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      width: 80%;
   }

   .name {
      color: #eceefb;
      margin: 10px;
   }

   .flex-bar {
      display: flex;
   }

   .vue {
      height: 28px !important;
      margin-top: 5px;
   }

   .image {
      height: 40px;
      max-width: 100%;
   }
</style>
