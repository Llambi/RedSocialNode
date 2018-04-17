//Módulos
var express = require('express');
var app = express();

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

var crypto = require('crypto');
var mongo = require('mongodb');
var swig = require("swig");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);

app.use(express.static("public"));

//Variables
app.set("port", 8081);
app.set("db", "mongodb://uo250708:EIISDI2018$@ds247499.mlab.com:47499/redsocial");
app.set("clave", "abcdefg");
app.set("crypto", crypto);

require("./routes/rUsuarios.js")(app, swig, gestorBD);
require("./routes/rPublicaciones.js")(app, swig, gestorBD);

app.get('/', function (req, res) {
    res.redirect('/redSocial');
});

//Controlar error
app.use(function (err, req, res, next) {
    console.log("Error producido: " + err); // we log the error in our db
    if (!res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});

//Lanzar aplicacion
app.listen(app.get('port'), function () {
    console.log("Servidor activo en puerto: " + app.get("port"));
});
