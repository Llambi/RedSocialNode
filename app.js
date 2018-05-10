//Módulos
var express = require('express');
var app = express();

// ZONA API ---------------------------
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

var rest = require('request');
app.set('rest',rest);

var jwt = require('jsonwebtoken');
app.set('jwt',jwt);
// ------------------------------------

//ZONA Require-------------------------
var crypto = require('crypto');
var mongo = require('mongodb');
var swig = require("swig");
var bodyParser = require("body-parser");

// Configuracion de gestorBD
var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);

//Configuracion de Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// ------------------------------------

// ZONA SESION/ROUTERS ----------------

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

//routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    // console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : " + req.session.destino)
        res.redirect("/login");
    }
});
//Aplicar routerUsuarioSession
app.use("/usuarios", routerUsuarioSession);

//routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    // obtener el token, puede ser un parámetro GET , POST o HEADER
    var token = req.body.token || req.query.token || req.headers['token'];
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
                res.status(403); // Forbidden
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403); // Forbidden
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});
//Aplicar routerUsuarioToken
app.use('/api/usuarios', routerUsuarioToken);

//-------------------------------------


app.use(express.static("public"));

//ZONA Variables-----------------------
app.set("port", 8081);
app.set("db", "mongodb://uo250708:EIISDI2018$@ds247499.mlab.com:47499/redsocial");
app.set("clave", "abcdefg");
app.set("crypto", crypto);
//-------------------------------------

require("./routes/rUsuarios.js")(app, swig, gestorBD);
require("./routes/rPublicaciones.js")(app, swig, gestorBD);
require("./routes/rAPI.js")(app, gestorBD);

app.get('/', function (req, res) {
    var respuesta = swig.renderFile('views/bRedSocial.html', {});
    res.send(respuesta);
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
