import { EventModel } from "./Event";

export class Dates {
   constructor(public date: number, public month: number, public year: number, public events: EventModel[]) {}
}
