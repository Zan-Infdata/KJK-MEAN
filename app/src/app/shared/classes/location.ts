import { Item } from "./item";

export class Location {
  _id!: string;
  name!: string;
  location!: string;
  description?: string;
  coordinates!: number[];
  locationType!: string;
  items!: Item[];
}