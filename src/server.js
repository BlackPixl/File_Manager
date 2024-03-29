var cookieparser = require('cookie-parser');
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
var bodyParser = require('body-parser')

// Initializations
const app = express();


//Settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "/views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.disable('x-powered-by');

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Global Variables

//Routes
app.use(require("./routes/index.routes"));

//Static files
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
