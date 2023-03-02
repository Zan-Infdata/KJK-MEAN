import { Location } from "./location"
import { Take } from "./take"

export class Item {
  _id!: string;
  itemType!: string;
  code!: string;
  name!: string;
  description?: string;
  quantity!: number;
  taken?: Take[];
  defaultLocation!: Location;
  dateTaken?: Date;

  constructor(id: string, itemType: string, code: string, name: string, quantity: number, defaultLocation: Location) {
    this._id = id;
    this.itemType = itemType;
    this.code = code;
    this.name = name;
    this.quantity = quantity;
    this.defaultLocation = defaultLocation;
  }
}
