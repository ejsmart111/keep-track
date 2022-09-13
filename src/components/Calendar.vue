<template>
   <div class="all" :style="{display: showInfo?'flex':'block'}">
      <div class="calendar" >
         <div class="date-info">
            <div class="container">
               <div class="flex header">
                  <span @click="setDate('minus')" class="caret ml-10">&#8249;</span>
                  <h3 class="head">{{ monthsInAYear[month] }} {{ year }}</h3>
                  <span @click="setDate('add')" class="caret mr-10">&#8250;</span>
               </div>
            </div>
         </div>
         <ul class="days-list">
            <li v-for="(day, index) in daysOfTheWeek" :key="index">{{ day.substr(0,3) }}</li>
         </ul>
         <div class="numbers">
            <div
               :style="{height: daysToDisplay.length > 35 ? 100/7.8+'vh': 100/6.5+'vh'}"
               class="number-box"
               :class="{'not-month': date.month !== month}"
               @click="showInfoMethod(date)"
               v-for="(date, i) in daysToDisplay"
            :key="i+'s'">
               <div
                  class="num"
                  :class="{'today': todaysDate.getDate() == date.date && todaysDate.getMonth() === date.month && todaysDate.getFullYear() === date.year}"
               >
                  <span>{{ date.date }}</span>
               </div>
               <div v-if="date.events.length" class="event-box">
                  <span sty class="event">{{ date.events[0].title.substring(0, 20) }} <span v-if="date.events[0].title.length > 20" >...</span></span>
                  <span class="event" v-if="date.events.length > 1">{{ date.events[1].title.substring(0, 20) }}<span v-if="date.events[1].title.length > 20" >...</span></span>
                  <small class="event-more" v-if="date.events.length > 2">+{{date.events.length - 2}} more</small>
               </div>
            </div>
         </div>
      </div>
      <div class="events" v-if="showInfo">
         <event-modal :date="activeDate" @close="showInfo = false"/>
      </div>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, Ref } from "@vue/runtime-core";
import { pushDate } from "../types/General";
import { Dates } from "../types/Dates"
import { EventModel } from "../types/Event";
import EventModal from './EventModal.vue'

export default defineComponent({
   components: {
      EventModal,
   },
   setup () {
      // Component properties
      const daysOfTheWeek = reactive(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
      const monthsInAYear = reactive(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
      const date = ref(new Date())
      const todaysDate = ref(new Date())
      const showInfo = ref(false)
      const activeDate = ref(new Dates(0, 0, 0, []))
      const daysToDisplay: Ref<Dates[]> = ref([])


      const year = computed(() => date.value.getFullYear())
      const month = computed(() => date.value.getMonth())
      const day = computed(() => date.value.getDate())

      // Methods
      const pushDate = (array: Dates[], date: number, month: number, year: number): void => {
         array.push({
            date,
            month,
            events: [],
            year,
         })
      }

      const setDaysToDisplay = (): void => {
         const dayWithTheFirstDate = new Date(year.value, month.value, 1).getDay()
         const numberOfDaysForPresentMonth = new Date(year.value, month.value+1, 0).getDate()
         const numberOfDaysForPrevMonth = new Date(year.value, month.value, 0).getDate()
         const dateYear = year.value
         const dateMonth = month.value
         for(let x = numberOfDaysForPrevMonth - dayWithTheFirstDate+1;  x <= numberOfDaysForPrevMonth; x++) {
            pushDate(daysToDisplay.value, x, dateMonth - 1 === -1? 11 : dateMonth - 1, month.value-1 == -1 ? dateYear - 1 : dateYear)
         }
         for(let j = 1; j <= numberOfDaysForPresentMonth; j++){
            pushDate(daysToDisplay.value, j, dateMonth, dateYear)
         }
         if (daysToDisplay.value.length % 7 !== 0 ){
            for(let a = 1; daysToDisplay.value.length % 7 !== 0; a++) {
               pushDate(daysToDisplay.value, a, dateMonth + 1, dateMonth+1 == 12 ? dateYear + 1: dateYear)
            }
         }
      }

      // Set date on Next and Prev click
      const setDate = (operator: string) => {
         daysToDisplay.value = []
         const operation = operator === 'add' ? +1 : -1
         date.value.setMonth(month.value + operation)
         date.value = new Date(date.value)
         setDaysToDisplay()
      }

      // Method executed when date is clicked
      const showInfoMethod = (date: Dates) => {
         activeDate.value = date
         showInfo.value = true
      }

      const fetchEventsFromStorage = () => {
         const events = JSON.parse(window.localStorage.getItem('events') as string)
         events.forEach((event: EventModel) => {
            const day = daysToDisplay.value.find(date => date.month === event.month && date.date === event.day && date.year === event.year)
            if (day)
               day.events.push(event)
         });
      }

      onMounted(() => {
         setDaysToDisplay()
         fetchEventsFromStorage()
      })

      return {
         daysOfTheWeek,
         daysToDisplay,
         day,
         month,
         year,
         monthsInAYear,
         todaysDate,
         showInfo,
         activeDate,
         setDate,
         showInfoMethod,
      }
   }
})
</script>

<style scoped>
.days-list {
   display: flex;
   justify-content: space-around;
   list-style: none;
   margin: 0;
   margin-top: 20px;
   padding: 0;
}
.calendar {
   animation: slide 0.3s ease-in-out;
   flex: 1 1  100%;
}
.events {
   flex: 1 0 300px;
}

.head {
   width: 200px;
}

.days-list li {
   color: #3d3d3d;
}

.date-info {
   border: 1px solid #e1e1e1;
   width: 100%;
}
.date-info h3 {
   color: #3d3d3d;
   text-align: center;
   margin-left: 40px;
   margin-right: 40px;
}

.event {
   background: #8585f0;
   border-radius: 5px;
   color: #fff;
   display: block;
   font-size: 13px;
   margin-top: 5px;
   padding: 3px;
   width: 100%;
}
.event-more {
   font-size: 13px;
   margin-top: 10px;
}

.numbers {
   display: flex;
   flex-wrap: wrap;
   margin-top: 20px;
}

.caret {
   cursor: pointer;
   font-size: 20px;
   margin-top: 15px;
}
.mr-10 {
   margin-right: 40px;
}
.ml-10 {
   margin-left: 40px;
}
.header {
   margin: 0 auto;
   max-width: 400px;
}

.event-box {
   margin-top: 5px;
}
.number-box {
   border: 1px solid #eeeeee;
   cursor: pointer;
   padding: 10px;
   width: 14.28%;
}
.number-box .num {
   text-align: center;
}
.not-month {
   color: #cbcbcb
}

.today {
   color: #6482f2;
   font-weight: bolder;
}

@keyframes slide {
   0% {
      width: 0px;
   }
   100% {
      width: 100%;
   }
}
</style>
