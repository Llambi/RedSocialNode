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
                }, "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                });
            }

        });
    });

    app.get("/api/usuarios", function (req, res) {
        var decoded = this.app.get("jwt").verify(token, 'secreto');
        var usuario = decoded.email;
        var criterio = {
            $and: [
                {
                    $or: [
                        {
                            sender: usuario,
                            reciver: usuario
                        }
                    ]
                },
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
                        usuarios.push({email: "/usuario/"+amigos[key].reciver, name: amigos[key].reciverName});
                    } else {
                        usuarios.push({email: "/usuario/"+amigos[key].sender, name: amigos[key].senderName});
                    }
                }
                amigos = JSON.stringify(usuarios);
                res.send(amigos);
            }
        });
    });
}