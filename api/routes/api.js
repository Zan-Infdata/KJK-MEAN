const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
});
const ctrlLocations = require("../controllers/locations");
const ctrlItems = require("../controllers/items");
const ctrlAuthentication = require("../controllers/authentication");

/**
 * Locations
 */
router.get("/locations",ctrlLocations.allLocationsList);
router.post("/location",auth,ctrlLocations.locationAdd);
router.get("/location/:locId",auth,ctrlLocations.locationById);
router.delete("/location/:locId",auth,ctrlLocations.deleteLocation);
router.get("/locations/:type",auth,ctrlLocations.locationsByTypeList);

/**
 * Items
 */
router.get("/items",auth,ctrlItems.allItemsList);
router.get("/item-types",ctrlItems.allItemTypes);
router.get("/item/:itmId",auth,ctrlItems.itemById);
router.get("/my-items",auth,ctrlItems.myItemList);
router.get("/available-items/:locationId",auth,ctrlItems.availableItems);
router.delete("/item/:itmId",auth, ctrlItems.removeItem);
router.post("/item",auth,ctrlItems.addItem);
router.post("/items-take",auth,ctrlItems.takeItems);
router.post("/item-return",auth,ctrlItems.returnItem);
router.put("/item/:itmId",auth,ctrlItems.updateItem);


//router.get("/db-reset",ctrlItems.dbReset);
//router.get("/db-fill",ctrlItems.dbFill);

/**
 * Authentication
 */
router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);

module.exports = router; 