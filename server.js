require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

/**
 * Swagger and OpenAPI
 */
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "KjeJeKaj",
      version: "1.0.0",
      description:
        "The official API for KjeJeKaj project.",
    },
    tags: [
      {
        name: "Locations",
        description: "<b>Locations</b> for storing Items.",
      },
      {
        name: "Items",
        description:
          "<b>Items</b> that can be stored in various locations.",
      },
    ],
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server for testing",
      },
      {
        url: "https://kje-je-kaj.fly.dev/api",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        ErrorMessage: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message describing the error.",
            },
          },
          required: ["message"],
        },
      },
    },
  },
  apis: ["./api/models/db-models.js","./api/models/users.js","./api/controllers/*.js"],
});
 


/**
 * Database connection
 */
require("./api/models/db.js");
require("./api/config/passport");

/**
 * Create server
*/
const app = express();

/**
 * CORS
*/
app.use(cors());

/**
 * Static pages
*/
app.use(express.static(path.join(__dirname, "app","dist","kje-je-kaj")));

app.use(passport.initialize());

/**
 * Body parser (application/x-www-form-urlencoded)
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * API routing
 */
const apiRouter = require("./api/routes/api");
app.use("/api", apiRouter);

app.get("/db", (_, res) => {
  res.sendFile(path.join(__dirname, "api", "views","db-reset.html"));
});

/**
 * Angular routing
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "dist","kje-je-kaj","index.html"));
});

 /**
  * Swagger file and explorer
  */
apiRouter.get("/swagger.json", (req, res) =>
  res.status(200).json(swaggerDocument)
);
apiRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

/**
 * Authorization error handler
 */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") res.status(401).json({ message: err.message });
});

/**
 * Start server
 */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `KJK app started in '${
      process.env.NODE_ENV || "development"
    } mode' listening on port ${port}!`
  );
});