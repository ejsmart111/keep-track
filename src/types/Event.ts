export class EventModel {
   constructor(public id: string, public title: string, public isRemote: Location, public day: number, public month: number, public year: number, public link: string, public location: LongLat){}
}

export type LongLat = {
   lat: number;
   lng: number
}

export enum Location {
   Remote = 1,
   OnSite = 2
}
