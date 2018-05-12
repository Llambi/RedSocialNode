module.exports = function (app, gestorBD) {

    app.post("/api/autenticar/", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        };
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                var token = app.get('jwt').sign({
                    usuario: criterio.email,
                    time: Date.now() / 1000
                }, 'secreto');
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                });
            }

        });
    });
    app.get("/api/usuarios", function (req, res) {
        var decoded = app.get("jwt").verify(req.headers['token'], 'secreto');
        var usuario = decoded.usuario;
        var criterio = {
            $and: [
                {$or: [{sender: usuario}, {receiver: usuario}]},
                {status: true}
            ]
        };

        gestorBD.obtenerAmigos(criterio, function (amigos) {
            if (amigos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                var usuarios = [];
                for (var key in amigos) {
                    if (amigos[key].sender == usuario) {
                        usuarios.push({email: "/usuario/" + amigos[key].receiver, name: amigos[key].receiverName});
                    } else {
                        usuarios.push({email: "/usuario/" + amigos[key].sender, name: amigos[key].senderName});
                    }
                }
                amigos = JSON.stringify(usuarios);
                res.send(amigos);
            }
        });
    });
    app.post("/api/mensaje", function (req, res) {
        var decoded = app.get("jwt").verify(req.headers['token'], 'secreto');
        var emisor = decoded.usuario;
        var destino = req.body.destino;
        var mensaje = req.body.texto;
        if (req.body.emisor == null || destino == null || mensaje == null) {
            res.status(400); // Faltan campos
            res.json({
                required: "emisor: email, destino: email y texto: message"
            });
            return;
        }
        if (emisor != req.body.emisor) {
            res.status(401); // El token proporcionado no corresponde con los datos del emisor
            res.json({
                info: "Token y emisor no coinciden"
            });
            return;
        }
        var mensaje = {
            emisor: emisor,
            destino: destino,
            mensaje: mensaje,
            leido: false
        };
        var criterio = {
            $and: [
                {$or: [{sender: emisor}, {receiver: emisor}]},
                {status: true}
            ]
        };
        gestorBD.obtenerAmigos(criterio, function (amigos) {
            if (amigos == null) {
                res.status(500);
                res.json({
                    info: "Se ha producido un error"
                })
            } else {
                for (var key in amigos) {
                    if (amigos[key].sender == emisor && amigos[key].receiver == destino
                        || amigos[key].receiver == emisor && amigos[key].sender == destino) {
                        gestorBD.crearMensaje(mensaje, function (result) {
                            if (result == null) {
                                res.status(500);
                                res.json({
                                    info: "Se ha producido un error"
                                });
                            } else {
                                res.status(200);
                                res.json({
                                    info: "Se ha creado el mensaje"
                                });
                            }
                        });
                    }
                }
            }
        });
    });
    app.post("/api/mensajes", function (req, res) {
        var decoded = app.get("jwt").verify(req.headers['token'], 'secreto');
        var usuarioA = req.body.usuarioA;
        var usuarioB = req.body.usuarioB;
        if (usuarioA == null || usuarioB == null) {
            res.status(400); // Faltan campos
            res.json({
                required: "usuarioA: email, usuarioB: email"
            });
            return;
        }
        if (usuarioA != decoded.usuario && usuarioB != decoded.usuario) {
            res.status(401); // El token proporcionado no corresponde con los datos de los usuarios
            res.json({
                info: "Token no coincide con ninguno de los usuarios"
            });
            return;
        }
        var criterio = {
            $or: [
                {$and: [{emisor: usuarioA}, {destino: usuarioB}]},
                {$and: [{emisor: usuarioB}, {destino: usuarioA}]}
            ]
        };
        gestorBD.obtenerMensajes(criterio, function (mensajes) {
            if (mensajes == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                var mostrar = [];
                for (var key in mensajes) {
                    mostrar.push({
                        emisor: "/usuario/" + mensajes[key].emisor,
                        destino: "/usuario/" + mensajes[key].destino,
                        texto: mensajes[key].mensaje
                    });
                }
                mensajes = JSON.stringify(mostrar);
                res.send(mensajes);
            }
        });
    });
}