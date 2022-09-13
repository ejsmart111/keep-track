import { EventModel } from "./Event";
import { Dates } from "./Dates";

export const validURL = (myURL: string) => {
   const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
   if (regexp.test(myURL)) {
      return true;
   } else {
      return false;
   }
}

export const uuid = () => {
   return Math.random().toString().replace("0.", "")
}

export const addToStorage = ((event: EventModel) => {
   let events = []
   if (window.localStorage.getItem('events') === null) {
      events.push(event)
   } else {
      events = JSON.parse(window.localStorage.getItem('events') as string)
      events.push(event)
   }
   window.localStorage.setItem('events', JSON.stringify(events))
})

export const pushDate = (array: Dates[], date: number, month: number, year: number): void => {
   array.push({
      date,
      month,
      events: [],
      year,
   })
}
