const mongoose = require("mongoose");
const Location = mongoose.model("Location");
const Item = mongoose.model("Item");
const User = mongoose.model("User");

const iT = require("../models/item-types");

/**
 * @openapi
 * /item-types:
 *  get:
 *   summary: Retrieve a list of all available item types.
 *   description: Get all available item types.
 *   tags: [Items]
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with item details.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *          type: string
 *        description: availible item types
 *        example: ["orodje", "taborno", "pripomočki", "drugo"]
 */

const allItemTypes = (_, res) => {
  res.status(200).json(iT.itemTypes);
}

/**
 * @openapi
 * /items:
 *  get:
 *   summary: Retrieve a list of all available items.
 *   description: Get all available items.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - none: No parameters
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with item details.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: <b>unique identifier</b> of item
 *          example: 635a62f5dc5d7968e6846574
 *         name:
 *          type: string
 *          description: <b>name</b> of item
 *          example: Sekira - velika
 *         description:
 *          type: string
 *          description: <b>description</b> of item
 *          example: Sekira FISKARS velika 60cm
 *         code:
 *          type: string
 *          description: <b>code</b> of the location
 *          example: sek-vel-fiskars
 *         itemType:
 *          type: string
 *          description: <b>type</b> of item
 *          example: oprema    
 *         quantity:
 *          type: number
 *          description: <b>quantity</b> of the item
 *          example: 6 
 *         taken:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Take'
 *          description: an array of takes for tracking where certain quantities of the item are.
 *          example: []
 *         defaultLocation:
 *          type: string
 *          description: <b>unique identifier</b> of default location where item is stored
 *          example: 635a62f5dc5d7968e6846574
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locations not found:
 *         value:
 *          message: "There's been an error or there are no items available."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const allItemsList = (_, res) => {
  Item.find().populate('defaultLocation').exec((err, result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!result)
      res
        .status(400)
        .json({ message: "There's been an error or there are no items available." });
    else res.status(200).json(result);
  })
}

/**
 * @openapi
 * /item/{itmId}:
 *  get:
 *   summary: Retrieve item with requested id.
 *   description: Get an item by its id.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: itmId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>unique identificator</b> of item
 *      example: 635a62f5dc5d7968e6846574
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with location type details.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: <b>unique identifier</b> of item
 *          example: 635a62f5dc5d7968e6846574
 *         name:
 *          type: string
 *          description: <b>name</b> of item
 *          example: Sekira - velika
 *         description:
 *          type: string
 *          description: <b>description</b> of item
 *          example: Sekira FISKARS velika 60cm
 *         code:
 *          type: string
 *          description: <b>code</b> of the location
 *          example: sek-vel-fiskars
 *         itemType:
 *          type: string
 *          description: <b>type</b> of item
 *          example: oprema    
 *         quantity:
 *          type: number
 *          description: <b>quantity</b> of the item
 *          example: 6 
 *         taken:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Take'
 *          description: an array of takes for tracking where certain quantities of the item are.
 *          example: []
 *         defaultLocation:
 *          type: string
 *          description: <b>unique identifier</b> of default location where item is stored
 *          example: 635a62f5dc5d7968e6846574
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locations not found:
 *         value:
 *          message: "No item with id 635a62f5dc5d7968e6846574"
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const itemById = (req,res) => {
  Item.find({_id : req.params.itmId}, (err,result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!result)
      res
        .status(400)
        .json({ message: "No item with id " + req.params.itmId });
    else res.status(200).json(result);
  })
}


/**
 * @openapi
 * /item/{itmId}:
 *  put:
 *   summary: Update an item.
 *   description: Update an item when it is in its default location.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: itmId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>unique identificator</b> of item
 *      example: 635a62f5dc5d7968e6846574
 *   requestBody:
 *     description: Item details
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *          description: <b>name</b> of item
 *          example: Sekira - velika
 *         description:
 *          type: string
 *          description: <b>description</b> of item
 *          example: Sekira FISKARS velika 60cm
 *         code:
 *          type: string
 *          description: <b>code</b> of the location
 *          example: sek-vel-fiskars
 *         itemType:
 *          type: string
 *          description: <b>type</b> of item
 *          example: oprema    
 *         quantity:
 *          type: number
 *          description: <b>quantity</b> of the item
 *          example: 6 
 *         defaultLocation:
 *          type: string
 *          description: <b>unique identifier</b> of default location where item is stored
 *          example: 635a62f5dc5d7968e6846574
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with location type details.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: <b>unique identifier</b> of item
 *          example: 635a62f5dc5d7968e6846574
 *         name:
 *          type: string
 *          description: <b>name</b> of item
 *          example: Sekira - velika
 *         description:
 *          type: string
 *          description: <b>description</b> of item
 *          example: Sekira FISKARS velika 60cm
 *         code:
 *          type: string
 *          description: <b>code</b> of the location
 *          example: sek-vel-fiskars
 *         itemType:
 *          type: string
 *          description: <b>type</b> of item
 *          example: oprema    
 *         quantity:
 *          type: number
 *          description: <b>quantity</b> of the item
 *          example: 6 
 *         taken:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Take'
 *          description: an array of takes for tracking where certain quantities of the item are.
 *          example: []
 *         defaultLocation:
 *          type: string
 *          description: <b>unique identifier</b> of default location where item is stored
 *          example: 635a62f5dc5d7968e6846574
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locations not found:
 *         value:
 *          message: "Item with id 635a62f5dc5d7968e6846574 not found."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const updateItem = (req, res) => {
  const itm = req.body;
  const itmId = req.params.itmId;

  Item.findById(itmId).exec((err, item) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!item) {
      res.status(404).json({
        message: "Item with id '" + itmId + "' not found.",
      });
    } else {

      item.itemType = itm.itemType;
      item.code = itm.code;
      item.name = itm.name;
      item.description = itm.description;
      item.quantity = itm.quantity;
      item.defaultLocation = itm.defaultLocation;

      item.save((err) => {
        if (err) res.status(500).json({ message: err.message });
        else res.status(200).json(item);
      })
    }
  })

}


/**
 * @openapi
 * /available-items/:locationId:
 *  get:
 *   summary: Retrieve a list of all available items in a default location.
 *   description: Get all available items in a default location.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - none: No parameters
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with item details.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: <b>unique identifier</b> of item
 *          example: 635a62f5dc5d7968e6846574
 *         name:
 *          type: string
 *          description: <b>name</b> of item
 *          example: Sekira - velika
 *         description:
 *          type: string
 *          description: <b>description</b> of item
 *          example: Sekira FISKARS velika 60cm
 *         code:
 *          type: string
 *          description: <b>code</b> of the location
 *          example: sek-vel-fiskars
 *         itemType:
 *          type: string
 *          description: <b>type</b> of item
 *          example: oprema    
 *         quantity:
 *          type: number
 *          description: <b>quantity</b> of the item
 *          example: 6 
 *         taken:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Take'
 *          description: an array of takes for tracking where certain quantities of the item are.
 *          example: []
 *         defaultLocation:
 *          type: string
 *          description: <b>unique identifier</b> of default location where item is stored
 *          example: 635a62f5dc5d7968e6846574
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locations not found:
 *         value:
 *          message: "No items with default location 635a62f5dc5d7968e6846574"
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const availableItems = (req, res) => {
  const locId = req.params.locationId;
  const items = [];
  Item.find({ defaultLocation: locId }, (err, rows) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!rows) res.status(404).json({ message: "No items with default location " + locId });
    else {
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        if (item.taken.length == 0) items.push(item);
        else {
          for (let k = 0; k < item.taken.length; k++) {
            const take = item.taken[k];
            if (!take.dateReturned) {
              item.quantity -= take.quantity;
            }
          }
          if (item.quantity > 0) items.push(item);
        }
      }
      res.status(200).json(items);
    }
  })
}

const getUser = (req, res, cbResult) => {
  if (req.auth && req.auth.email) {
    User.findOne({ email: req.auth.email }).exec((err, user) => {
      if (err) res.status(500).json({ message: err.message });
      else if (!user) res.status(404).json({ message: "User not found." });
      else cbResult(req, res, user);
    });
  }
};


/**
 * @openapi
 * /items-take:
 *  post:
 *   summary: Take items to a location.
 *   description: Take items from a permanent location to a temporary location.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   requestBody:
 *     description: Item details
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         toLocation:
 *          type: string
 *          description: <b>unique identificatior</b> of location where item is taken.
 *          example: 635a62f5dc5d7968e6846574
 *         items:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Take'
 *          description: an array of items you are taking.
 *          example: []
 *   responses:
 *    '200':
 *     description: <b>OK</b>.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *         value:
 *          message: "Items were successfully taken."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const takeItems = async (req, res) => {
  const locId = req.body.toLocation;
  const items = req.body.items;

  getUser(req, res, async (_, res, user) => {
    for (const itm of items) {
      await new Promise((resolve, reject) => {
        Item.findById(itm._id).select("taken").exec((err, item) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
            reject();
          }
          item.taken.push({ user: user._id, quantity: itm.quantity, location: locId });
          item.save((err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: err.message });
              reject();
            }
            Location.findById(locId).select("items").exec((err, location) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
                reject();
              }
              if (!location.items.includes(item._id)) {
                location.items.push(item._id);
                location.save((err) => {
                  if (err) {
                    console.error(err);
                    res.status(500).json({ message: err.message });
                    reject();
                  } else resolve();
                })
              } else resolve();
            })
          })
        })
      })
    }

    res.status(200).json({ message: "Items were successfully taken." });
  })  
}


/**
 * @openapi
 * /items-return:
 *  post:
 *   summary: Return items to their default locations.
 *   description: Return items you took to their default locations.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   requestBody:
 *     description: return details of the request
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         location:
 *          type: string
 *          description: <b>unique identificatior</b> of location where item is returned to.
 *          example: 635a62f5dc5d7968e6846574
 *         item:
 *           $ref: '#/components/schemas/Item'
 *   responses:
 *    '200':
 *     description: <b>OK</b>.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *         value:
 *          message: "Item was successfully returned."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const returnItem = (req, res) => {
  const loc = req.body.location;
  const itm = req.body.item;

  getUser(req, res, (_, res, user) => {
    Item.findById(itm._id, (err, item) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
        return;
      }
      let q = 0;
      let returned = false;
      for (let i = 0; i < item.taken.length; i++) {
        const take = item.taken[i];
        if (take.location == loc._id && !take.dateReturned) {
          q += take.quantity;
          if (!returned && take.user.equals(user._id)) {
            take.quantity--;
            q--;
            returned = true;
            if (take.quantity == 0) {
              take.dateReturned = new Date();
            }
            item.save((err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
                return;
              }
            })
            if (take.quantity > 0) {
              res.status(200).json({ message: "Item was successfully returned." });
              return;
            }
          }
        }
      }
      if (q == 0) {
        Location.findById(loc._id, (err, location) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
            return;
          }
          const i = location.items.indexOf(item._id);
          if (i > -1) {
            location.items.splice(i, 1);
            location.save((err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
              } else {
                res.status(200).json({ message: "Item was successfully returned." });
              }
            })
          }
        })
      }
    })
  })
}


/**
 * @openapi
 * /my-items:
 *  get:
 *   summary: Retrieve a list of all temporary locations with items im responsible for.
 *   description: Get all temporary locations and items at those locations that the user took
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with location details.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: <b>unique identifier</b> of location
 *          example: 635a62f5dc5d7968e6846574
 *         name:
 *          type: string
 *          description: <b>name</b> of the location
 *          example: Skladišče Tržaška cesta
 *         description:
 *          type: string
 *          description: <b>description</b> of the location
 *          example: Skladišče na Tržaški cesti
 *         location:
 *          type: string
 *          description: <b>address</b> of the location
 *          example: Tržaška cesta 6, 1000 Ljubljana
 *         coordinates:
 *           type: array
 *           items:
 *            type: number
 *            minItems: 2
 *            maxItems: 2
 *            description: GPS coordinates of the location
 *            example: [42.1236, 56.1236]      
 *         locationType:
 *          type: string
 *          description: <b>Type</b> of the location
 *          example: permanent
 *         items:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Item'
 *          description: <b>Items</b> on the location
 *          example: []
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locations not found:
 *         value:
 *          message: "There's been an error or there are no items available."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const myItemList = (req, res) => {
  Location.find({ locationType: 'temporary' }).populate("items").exec((err, result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!result)
      res
        .status(400)
        .json({ message: "There's been an error or there are no items available." });
    else res.status(200).json(result);
  })
}


/**
 * @openapi
 * /item/{itmId}:
 *  delete:
 *   summary: Delete item with requested id.
 *   description: Delete a item by its id.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: itmId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>unique identificator</b> of item
 *      example: 635a62f5dc5d7968e6846574
 *   responses:
 *    '200':
 *      description: <b>No Content</b>, with no content.
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locations not found:
 *         value:
 *          message: "Item not found"
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const removeItem = (req, res) => {
  const itmId = req.params.itmId;
  Item.deleteOne({ _id: itmId }, (err, result) =>{
    if (err) res.status(500).json({ message: err.message });
    else if (!result) res.status(404).json({ message: "Item not found" });
    else{
      res.status(200).json(itmId);
    }
  })
};



/**
 * @openapi
 * /item:
 *  post:
 *   summary: Add an item.
 *   description: Add an item to a location.
 *   tags: [Items]
 *   security:
 *    - jwt: []
 *   requestBody:
 *     description: Item details
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *          description: <b>name</b> of item
 *          example: Sekira - velika
 *         description:
 *          type: string
 *          description: <b>description</b> of item
 *          example: Sekira FISKARS velika 60cm
 *         code:
 *          type: string
 *          description: <b>code</b> of the location
 *          example: sek-vel-fiskars
 *         itemType:
 *          type: string
 *          description: <b>type</b> of item
 *          example: oprema    
 *         quantity:
 *          type: number
 *          description: <b>quantity</b> of the item
 *          example: 6 
 *         defaultLocation:
 *          type: string
 *          description: <b>unique identifier</b> of default location where item is stored
 *          example: 635a62f5dc5d7968e6846574
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with location type details.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: <b>unique identifier</b> of item
 *          example: 635a62f5dc5d7968e6846574
 *         name:
 *          type: string
 *          description: <b>name</b> of item
 *          example: Sekira - velika
 *         description:
 *          type: string
 *          description: <b>description</b> of item
 *          example: Sekira FISKARS velika 60cm
 *         code:
 *          type: string
 *          description: <b>code</b> of the location
 *          example: sek-vel-fiskars
 *         itemType:
 *          type: string
 *          description: <b>type</b> of item
 *          example: oprema    
 *         quantity:
 *          type: number
 *          description: <b>quantity</b> of the item
 *          example: 6 
 *         taken:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Take'
 *          description: an array of takes for tracking where certain quantities of the item are.
 *          example: []
 *         defaultLocation:
 *          type: string
 *          description: <b>unique identifier</b> of default location where item is stored
 *          example: 635a62f5dc5d7968e6846574
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locations not found:
 *         value:
 *          message: "Location with id 635a62f5dc5d7968e6846574 not found."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const addItem = (req, res) => {
  const itm = req.body;

  Location.findById(itm.defaultLocation).exec((err, location) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!location) {
      res.status(404).json({
        message: "Location with id '" + itm.defaultLocation + "' not found.",
      });
    } else {
      const item = new Item({
        _id: new mongoose.Types.ObjectId(),
        itemType: itm.itemType,
        code: itm.code,
        name: itm.name,
        description: itm.description,
        quantity: itm.quantity,
        defaultLocation: location,
      })

      item.save((err) => {
        if (err) res.status(500).json({ message: err.message });
        else res.status(200).json(location.items.pop());
      })
    }
  })
}


/**
 * @openapi
 * /db-reset:
 *  post:
 *   summary: Drop db.
 *   description: Delete all locations and Items.
 *   tags: [Db manipulation]
 *   responses:
 *    '200':
 *     description: <b>OK</b>.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *         value:
 *          message: "DB was successfully reset."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const dbReset = async (_,res) => {
  await Location.deleteMany((err) =>{
    if (err) res.status(500).json({ message: err.message });
  });
  await Item.deleteMany((err) =>{
    if (err) res.status(500).json({ message: err.message });
  });
  res.status(200).send("DB was successfully reset.");
}

/**
 * @openapi
 * /db-fill:
 *  post:
 *   summary: Fill db.
 *   description: Fill db with test items and locations.
 *   tags: [Db manipulation]
 *   responses:
 *    '200':
 *     description: <b>OK</b>.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *         value:
 *          message: "DB successfully filled with test data."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const dbFill = async (_,res) => {
  await Location.deleteMany((err) =>{
    if (err) res.status(500).json({ message: err.message });
  });
  await Item.deleteMany((err) =>{
    if (err) res.status(500).json({ message: err.message });
  });
  
  const defLoc = new mongoose.Types.ObjectId();

  const testLocations = [
    {
      _id: defLoc,
      name: "Skladišče Rakovnik",
      description: "Skladišče Rakovnik - stalno",
      location: "Rakovniška ulica 6, 1000 Ljubljana",
      coordinates: [46.036856,14.525942],
      locationType: "permanent",
      items: [],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Tabor IV 2022",
      description: "Taborna lokacije veje IV, julij 2022",
      location: "Ševlje",
      coordinates: [46.200932,14.248036],
      locationType: "temporary",
      items: [],
    }
  ]

  for await (loc of testLocations) {
    const newLoc = new Location(loc);
    newLoc.save((err) =>{
      if (err) res.status(500).json({ message: err.message });
    });
  }

  const testItems = [
    {
      _id: new mongoose.Types.ObjectId(),
      itemType: "orodje",
      code: "lop-stih",
      name: "Lopata - štiharca",
      description: null,
      quantity: 4,
      defaultLocation: defLoc
    },
    {
      _id: new mongoose.Types.ObjectId(),
      itemType: "orodje",
      code: "zaga-vel",
      name: "Žaga - velika",
      description: null,
      quantity: 4,
      defaultLocation: defLoc
    },
    {
      _id: new mongoose.Types.ObjectId(),
      itemType: "orodje",
      code: "zaga-mala",
      name: "Žaga - mala",
      description: null,
      quantity: 3,
      defaultLocation: defLoc
    },
    {
      _id: new mongoose.Types.ObjectId(),
      itemType: "taborno",
      code: "jamboree",
      name: "Jamboree set 1",
      description: null,
      quantity: 1,
      defaultLocation: defLoc
    },
  ];

  for await (itm of testItems) {
    const newItem = new Item(itm);
    newItem.save((err) =>{
      if (err) res.status(500).json({ message: err.message });
    });
  }

  res.status(200).send("DB successfully filled with test data.");
  
}


module.exports = {
  allItemTypes,
  allItemsList,
  addItem,
  availableItems,
  takeItems,
  returnItem,
  myItemList,
  itemById,
  updateItem,
  removeItem,
  dbReset,
  dbFill
}