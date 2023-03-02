const mongoose = require('mongoose');
const iT = require("./item-types");

/**
 * @openapi
 * components:
 *  schemas:
 *   Location:
 *    type: object
 *    description: <b>Locations</b> for storing Items.
 *    properties:
 *     _id:
 *      type: string
 *      description: unique identifier
 *     name:
 *      type: string
 *      description: name of the location
 *     description:
 *      type: string
 *      description: description of the location
 *     location:
 *      type: string
 *      description: textual description of actual location
 *     coordinates:
 *      type: array
 *      items:
 *       type: number
 *      minItems: 2
 *      maxItems: 2
 *      description: GPS coordinates of the location
 *     locationType:
 *      type: string
 *      description: type of the location
 *     items:
 *      $ref: '#/components/schemas/Item'
 *    required:
 *     - _id
 *     - name
 *     - location
 *     - coordinates
 *     - type
 */

const locationSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: [true, "Name of location is required"] },
  description: { type: String, required: false },
  location: { type: String, required: [true, "The location field describes where this location is. So yeah, it's required."] },
  coordinates: {
    type: [Number],
    validate: {
      validator: (v) => Array.isArray(v) && v.length == 2,
      message: "Coordinates must be an array of two numbers!",
    },
    index: "2dsphere"
  },
  locationType: { type: String, enum: ["permanent", "temporary"], required: [true, "Location type is required."] },
  items: { type: [mongoose.Types.ObjectId], ref: "Item" }
})

mongoose.model("Location", locationSchema, "Locations");


/**
 * @openapi
 * components:
 *  schemas:
 *   Take:
 *    type: object
 *    description: A descriptor for <b>Taking</b> and Item to a Location.
 *    properties:
 *     _id:
 *      type: string
 *      description: unique identifier
 *     user:
 *      $ref: '#/components/schemas/User'
 *      description: the user that took the item
 *     quantity:
 *      type: number
 *      description: the quantity of the item to be taken
 *     location:
 *      $ref: '#/components/schemas/Location'
 *      description: the location to which you are taking the item
 *     dateTook:
 *      type: string
 *      description: the date on which you are taking the item
 *      format: date-time
 *     dateReturned:
 *      type: string
 *      description: the date on which you are returning the item - if empty, the item is not returned yet
 *      format: date-time
 *    required:
 *     - _id
 *     - quantity
 *     - location
 *     - dateTook
 */

const takeSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: [true, "We need to know who took the item(s)."] },
  quantity: { type: Number, required: [true, "We need to know how many of an item you took!"] },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: [true, "Tell us where you are taking the item in such a quantity."] },
  dateTook: { type: Date, default: Date.now, required: true },
  dateReturned: { type: Date }
})


/**
 * @openapi
 * components:
 *  schemas:
 *   Item:
 *    type: object
 *    description: <b>Items</b> that can be stored in various locations.
 *    properties:
 *     _id:
 *      type: string
 *      description: unique identifier
 *     itemType:
 *      type: string
 *      description: type of the item
 *     code:
 *      type: string
 *      description: unique code of the item
 *     name:
 *      type: string
 *      description: name of the item
 *     description:
 *      type: string
 *      description: description of the item
 *     quantity:
 *      type: number
 *      description: the quantity of the item available for taking
 *     taken:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Take'
 *      description: an array of takes for tracking where certain quantities of the item are.
 *     defaultLocation:
 *      $ref: '#/components/schemas/Location'
 *      type: string
 *      description: textual description of actual location
 *    required:
 *     - _id
 *     - name
 *     - location
 *     - coordinates
 *     - type
 */

const itemSchema = new mongoose.Schema({
  itemType: { type: String, enum: iT.itemTypes, required: [true, "Item type is required for filtering purposes."] },
  code: { type: String, unique: true, required: [true, "You will search for items with this code."] },
  name: { type: String, unique: true, required: [true, "You will search for items with this name."] },
  description: { type: String, required: false },
  quantity: { type: Number, required: [true, "We need to know how many of an item there is to take."], default: 1, min: 1 },
  taken: { type: [takeSchema], required: false },
  defaultLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: [true, "Tell us where the default location for this item is, so we can assign it to the item when you return it."] }
})

mongoose.model("Item", itemSchema, "Items");