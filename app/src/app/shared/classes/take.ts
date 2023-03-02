import { Location } from "./location"

export class Take {
  _id!: string;
  user!: string;
  quantity!: number;
  location!: Location;
  dateTook!: Date;
  dateReturned?: Date;
}