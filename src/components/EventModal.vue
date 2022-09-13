<template>
   <div class="form">
      <div class="header">
         <h4>Your Events</h4>
         <font-awesome-icon icon="fa-solid fa-x" class="close-x" size="xs" @click="close" />
      </div>
      <div class="displayDate">
         <p>{{ displayDay }}</p>
      </div>
      <div class="btn">
         <button @click="addNewEvent" class="add-btn">{{!showForm?'Add new': 'Close Form'}}</button>
      </div>
      <div v-if="error.length > 0" class="err">
         <small v-for="(err, index) in error" :key="index+'sd'"> {{err}} <small v-if="index !== error.length -1 ">and </small></small>
      </div>
      <div v-if="showForm" class="form-fields">
         <label class="label">Title</label>
         <input class="form-control" v-model="title" /><br>

         <div class="flex">
            <label class="radio-container"><span class="radio-text">Remote</span>
               <input :value="1" type="radio" v-model="isRemote" name="location">
               <span class="checkmark"></span>
            </label>
            <label class="radio-container on"><span class="radio-text">On Site</span>
               <input :value="2" type="radio"  v-model="isRemote" name="location">
               <span class="checkmark"></span>
            </label>
         </div>

         <div class="mt-1" v-if="isRemote === Location.Remote">
            <label class="label">Meeting link</label>
            <input class="form-control" v-model="link" /><br>
         </div>

         <div class="mt-1 flex s-between" v-if="isRemote === Location.OnSite">
            <div>
               <label class="label">Longitude</label>
               <input type="number" class="form-control lnglat" v-model="longLat.lng" /><br>
            </div>
            <div>
               <label class="label">Latitude</label>
               <input type="number" class="form-control lnglat" v-model="longLat.lat" />
            </div>
         </div>

         <button class="submit" @click="submit">{{ isUpdate?'Update':'Save' }}</button>
         <hr>
      </div>
      <div class="events-list">
         <div v-for="(event, index) in dateDetails.events" :key="index" class="event">
            <span><font-awesome-icon :style="{color: '#8485F0'}" icon="fa-solid fa-circle-dot" class="event-icon" size="2xs" /></span>
            <span @click="editEvent(event)" class="event-title">{{ event.title }}</span>
            <span class="event-delete"><font-awesome-icon @click="deleteEvent(event)" :style="{color: 'red', marginLeft: '20px'}" class="trash" icon="fa-solid fa-trash-alt" /></span>
            <div v-if="event.isRemote === 1">
               <div>
                  <span><font-awesome-icon icon="fa-solid fa-link" class="link-icon" size="2xs" /></span>
                  <small class="link-text"><a :href="event.link" target="_blank">Visit meeting link</a></small>
               </div>
            </div>
            <div v-else>
               <div>
                  <span><font-awesome-icon icon="fa-solid fa-location-dot" class="location-icon" size="xs" /></span>
                  <small @click="showMap($event)" class="link-texts">Checkout location</small>
                  <div ref="mapToShow" class="mapToShow">
                     <div class="map-x">
                        <font-awesome-icon icon="fa-solid fa-x" class="close-x" size="2xs" @click="closeMap(index)" />
                     </div>
                     <map-vue :event="event" />
                  </div>
               </div>
            </div>

         </div>
         <p v-if="!dateDetails.events.length" class="none">No events at the moment for this day</p>
      </div>
      <toast-vue :toastObj="toastObj" v-if="showToast" />
   </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, reactive, computed, toRef, watch } from "@vue/runtime-core";
import { uuid, validURL, addToStorage } from '../types/General'
import { Location, LongLat, EventModel } from '../types/Event'
import { Dates } from '../types/Dates'
import MapVue from "./Map.vue";
import ToastVue from "./Toast.vue";

export default defineComponent({
   emits: ['close'],
   components: {
      MapVue,
      ToastVue
   },
   props: {
      date: {
         type: Object as PropType<Dates>,
         required: true
      }
   },

   setup(props, {emit}) {
      // Properties
      const isRemote = ref(Location.Remote)
      const title = ref('')
      const link = ref('')
      const error: Ref<string[]> = ref([])
      let longLat: LongLat = reactive({
         lng: 0,
         lat: 0
      })
      const events: Ref<EventModel[]> = ref([])
      const showForm = ref(false)
      const dateDetails = toRef(props, 'date')
      const isUpdate = ref(false)
      const id = ref('')
      const showToast = ref(false)
      const mapToShow = ref(null)
      let toastObj = reactive({ message: '', type: '' })

      // Computed
      const displayDay = computed(() => {
         return new Date(`${dateDetails.value.month+1}-${dateDetails.value.date}-${dateDetails.value.year}`).toDateString()
      })
      const validation = computed(() => {
         if (title.value === '' ) return false
         else if (isRemote.value === 1 && !validURL(link.value)) return false
         else if (title.value === '' && (isRemote.value === 1 && !validURL(link.value))) return false
         else return true
      })


      // Methods
      const close = () => {
         emit('close')
      }
      const showMap = (e: Event) => {
        ((e.target as Node).nextSibling as HTMLElement).style.display = 'block'
      }
      const closeMap = (i: number) => {
         const map = mapToShow.value as HTMLElement[]|null
         if ( map )
            map[i].style.display = 'none'
      }
      const addNewEvent = () => {
         isUpdate.value = false
         showForm.value = !showForm.value
      }
      const removeToast = () => {
         setTimeout(() => {
            showToast.value = false
         }, 2000);
      }
      const submit = () => {
         error.value = []
         if (validation.value) {
            if (!isUpdate.value) {
               id.value = uuid()
               const event = new EventModel(id.value, title.value, isRemote.value, dateDetails.value.date, dateDetails.value?.month, dateDetails.value?.year, link.value, longLat)
               dateDetails.value.events.push(event)
               addToStorage(event)
               reinitializeForm()
               toastObj.message = 'New item has been added!!!',
               toastObj.type = 'Add'
               showToast.value = true
               removeToast()
            } else {
               const index = dateDetails.value.events.findIndex(event => event.id === id.value)
               const event = new EventModel(id.value, title.value, isRemote.value, dateDetails.value.date, dateDetails.value?.month, dateDetails.value?.year, link.value, longLat)
               if (index !== -1) {
                  const i = dateDetails.value.events.findIndex((event: EventModel) => event.id === id.value)
                  const events = JSON.parse(window.localStorage.getItem('events') as string)
                  dateDetails.value.events.splice(index, 1, event)
                  if (i !== -1) {
                     dateDetails.value.events.splice(i, 1, event)
                  }
                  events.splice(index, 1, event)
                  window.localStorage.setItem('events', JSON.stringify(events))
                  toastObj.message = 'Item has been updated',
                  toastObj.type = 'Update'
                  showToast.value = true
                  removeToast()
               }
            }
         } else {
            if (title.value === '' && (isRemote.value === 1 && !validURL(link.value))) {
               error.value.push('A title is required')
               error.value.push('Link is invalid')
            } else {
               if (title.value === '') error.value.push('A title is required')
               if (isRemote.value === 1 && !validURL(link.value)) error.value.push('Link is invalid')
            }
         }
      }
      const reinitializeForm = () => {
         title.value = ''
         isRemote.value = 1
         longLat = {lng: 0, lat: 0}
         link.value = ''
      }
      const editEvent = (event: EventModel) => {
         showForm.value = true
         isUpdate.value = true
         title.value = event.title
         isRemote.value = event.isRemote
         link.value = event.link
         id.value = event.id
         longLat.lat = event.location.lat
         longLat.lng = event.location.lng
      }
      const deleteEvent = (chosenEvent: EventModel) => {
         const events = JSON.parse(window.localStorage.getItem('events') as string)
         const index = events.findIndex((event: EventModel) => event.id === chosenEvent.id)
         if (index !== -1) {
            const id = dateDetails.value.events.findIndex((event: EventModel) => event.id == chosenEvent.id)
            events.splice(index, 1)
            if (id !== -1) {
               dateDetails.value.events.splice(id, 1)
            }
            toastObj.message = 'Item has been deleted',
            toastObj.type = 'Delete'
            showToast.value = true
            removeToast()
            reinitializeForm()
         }
         window.localStorage.setItem('events', JSON.stringify(events))
      }

      watch(displayDay, () => {
         showForm.value = false
         isUpdate.value = false
         reinitializeForm()
      })

      return {
         isRemote,
         link,
         isUpdate,
         title,
         Location,
         longLat,
         events,
         displayDay,
         showForm,
         dateDetails,
         error,
         showToast,
         mapToShow,
         toastObj,
         close,
         addNewEvent,
         submit,
         editEvent,
         deleteEvent,
         showMap,
         closeMap
      }
   }
})
</script>

<style scoped>
   .event:hover .event-delete {
      display: inline;
   }
   .event-delete {
      cursor: pointer;
      display: none;
   }
   .btn {
      padding: 10px;
   }
   .s-between {
      gap: 1em;
      justify-content: start;
   }
   hr {
      border: 1px solid #e6e6e6;
   }
   .err {
      color: red;
      padding: 10px;
   }
   .form {
      background: #fff;
      box-shadow: 1px 2px 10px rgba(37, 37, 37, 0.435);
      height: 100vh;
      position: fixed;
      right: 0;
      top: 0;
      min-width: 300px;
   }
   .none {
      color: #5a5959;
      font-size: 14px;
   }

   .events-list {
      padding: 10px
   }
   .mapToShow {
      display: none;
      margin-top: 10px;
   }
   .event-title {
      color: #404040;
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
   }
   .event:not(:first-of-type) {
      margin-top: 20px;
   }
   .link-text a {
      color: #7c7c7c;
      cursor: pointer;
      font-size: 12px;
      margin-left: 10px;
      margin-top: 20px;
      text-decoration: none;
   }
   .link-texts {
      color: #7c7c7c;
      cursor: pointer;
      font-size: 12px;
      margin-left: 10px;
      margin-top: 20px;
      text-decoration: none;
   }
   .link-text a:hover {
      text-decoration: underline;
   }
   .link-icon {
      color: #219ce8;
      margin-left: 18px;
      margin-top: 10px;
   }
   .map-x {
      background: rgb(243, 243, 243);
      text-align: right;
      padding: 3px 10px;
   }
   .location-icon {
      color: #af2a0f;
      margin-left: 18px;
      margin-top: 10px;
   }

   .form-fields {
      padding: 10px;
   }
   .label {
      font-size: 12px !important;
   }
   .form-control {
      border: 1px solid #d7d7d7;
      border-radius: 3px;
      box-shadow: 0;
      display: block;
      margin-top: 6px;
      padding: 10px;
      width: 100%;
   }

   .displayDate {
      border-bottom: 1px solid #d7e2fa;
      padding: 0 10px;
   }

   .header {
      background: #f3fcff;
      border-bottom: 1px solid #d7e2fa;
      border-top: 1px solid #d7e2fa;
      display: flex;
      justify-content: space-between;
      padding: 15px 10px;
   }
   .header h4 {
      margin: 0;
      margin-top: 6px;
   }

   .add-btn {
      background: #18b018;
      border: none;
      border-radius: 3px;
      color: #ffffff;
      padding: 8px;
   }
   button {
      cursor: pointer;
   }

   .submit {
      background: #247ede;
      border: none;
      border-radius: 3px;
      color: #ffffff;
      display: block;
      padding: 8px;
      width: 100%;
   }

   .on {
      margin-left: 20px;
   }

   .mt-1 {
      margin-top: 8px;
   }
   .lnglat {
      max-width: 120px;
   }

   .close {
      text-align: right;
      margin-bottom: 10px;
   }
   .close-x {
      cursor: pointer;
      margin-top: 10px;
   }
</style>
