const mongoose = require("mongoose");
const Location = mongoose.model("Location");


/**
 * @openapi
 * /locations:
 *  get:
 *   summary: Retrieve a list of all available locations.
 *   description: Get all available locations
 *   tags: [Locations]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - none: No parameters
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
 *          description: <b>Type</b> of the location
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
 *          message: "There's been an error or there are no locations available."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const allLocationsList = (_,res) => {
  Location.find().populate("items").exec((err,result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!result)
      res
        .status(400)
        .json({ message: "There's been an error or there are no locations available." });
    else res.status(200).json(result);
  })
}

/**
 * @openapi
 * /location/{type}:
 *  get:
 *   summary: Retrieve all locations that are the requested type.
 *   description: Get all locations by type.
 *   tags: [Locations]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: type
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>type</b> of location
 *      example: permanent
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
 *          description: <b>Type</b> of the location
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
 *          message: "There's been an error or there are no locations of that type available."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const locationsByTypeList = (req,res) => {
  Location.find({locationType : req.params.type}, (err,result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!result)
      res
        .status(400)
        .json({ message: "There's been an error or there are no locations of that type available." });
    else res.status(200).json(result);
  })
}


/**
 * @openapi
 * /location/{locId}:
 *  get:
 *   summary: Retrieve location with requested id.
 *   description: Get a location by its id.
 *   tags: [Locations]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: locId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>unique identificator</b> of location
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
 *          description: <b>Type</b> of the location
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
 *          message: "No location with id 635a62f5dc5d7968e6846574"
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const locationById = (req,res) => {
  Location.find({_id : req.params.locId}, (err,result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!result)
      res
        .status(400)
        .json({ message: "No location with id " + req.params.locId });
    else {
      setTimeout(() => {
        res.status(200).json(result);
      },5000);
    }
  })
}

/**
 * @openapi
 * /location/{locId}:
 *  delete:
 *   summary: Delete location with requested id.
 *   description: Delete a location by its id.
 *   tags: [Locations]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: locId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>unique identificator</b> of location
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
 *          message: "Location not found"
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const deleteLocation = (req,res) => {
  Location.deleteOne({_id : req.params.locId}, (err,result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (!result) res.status(404).json({ message: "Location not found" }); 
    else res.status(200).send();
  })
}

/**
 * @openapi
 * /location:
 *  post:
 *   summary: Add a location.
 *   description: Add a location to the list of locations.
 *   tags: [Locations]
 *   security:
 *    - jwt: []
 *   requestBody:
 *     description: Location details
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
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
 *          description: <b>Type</b> of the location
 *          example: []
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

const locationAdd = (req, res) => {
  const loc = req.body;
  const location = new Location({
    _id: new mongoose.Types.ObjectId(),
    name: loc.name,
    description: loc.description || null,
    location: loc.location,
    coordinates: loc.coordinates,
    locationType: loc.locationType,
    items: []
  })

  location.save((err) => {
    if (err) {
      res.status(500).json({ message: err.message });
      
    } else {
      res.status(200).json(location);
    }
  })
}


module.exports = {
  allLocationsList,
  locationAdd,
  locationsByTypeList,
  locationById,
  deleteLocation
}