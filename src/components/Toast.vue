<template>
   <div :style="{background: backgroundStyle}" class="toast">
      <p>{{ toastObj?.message }}</p>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "@vue/runtime-core";

type ToastObj = {
   message: string,
   type: string
}
export default defineComponent({
   props: {
      toastObj: {
         type: Object as PropType<ToastObj>
      }
   },
   setup(props) {
      const { toastObj } = toRefs(props) as any
      const backgroundStyle = computed(() => {
         return toastObj.value.type === 'Add'? '#18aa18': toastObj.value.type === 'Update'? '#207fc8': '#ce3636'
      })

      return {
         backgroundStyle,
      }
   }
})
</script>

<style scoped>
   .toast {
      border-radius: 5px;
      box-shadow: 1px 2px 20px #373636;
      color: #fff;
      right: 5px;
      top: 20px;
      padding: 20px 10px;
      position: fixed;
      width: 300px;
   }
   .toast p {
      font-size: 14px;
      margin: 0;
   }
</style>
