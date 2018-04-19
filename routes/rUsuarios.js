module.exports = function (app, swig, gestorBD) {

    app.get("/signup", function (req, res) {
        var respuesta = swig.renderFile('views/bSignUp.html', {});
        res.send(respuesta);
    });

    app.post('/usuario', function (req, res) {
        var criterio = {
            $or: [
                {email: req.body.email}
            ]
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (req.body.password != req.body.rePassword) {
                res.redirect("/signup?mensaje=Error al registrar usuario, las contraseñas no coinciden.&tipoError=pass");
            }
            else if (!(usuarios == null || usuarios == undefined || usuarios.length == 0)) {
                res.redirect("/signup?mensaje=Error al registrar usuario, el email ya esta registrado en la aplicacion.&tipoMensaje=alert-danger&tipoError=Repetido");
            } else {
                var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                    .update(req.body.password).digest('hex');
                var usuario = {
                    "name": req.body.name,
                    "email": req.body.email,
                    "password": seguro
                }
                gestorBD.insertarUsuario(usuario, function (id) {
                    if (id == null) {
                        res.redirect("/signup?mensaje=Error al registrar usuario.&tipoMensaje=alert-danger");
                    } else {
                        res.redirect("/login?mensaje=Nuevo usuario registrado.");
                    }
                })
            }
        })
    });

    app.get("/login", function (req, res) {
        var respuesta = swig.renderFile('views/bLogin.html', {});
        res.send(respuesta);
    });

    app.post("/login", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/login" +
                    "?mensaje=Email o password incorrecto" +
                    "&tipoMensaje=alert-danger ");

            } else {
                req.session.usuario = {name:usuarios[0].name, email:usuarios[0].email};
                res.redirect("/usuarios");
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.session.usuario = null;
        res.redirect("/" +
            "?mensaje=Desconectado correctamente" +
            "&tipoMensaje=alert-success ");
    });

    app.get("/usuarios", function (req, res) {
        var busqueda = req.query.busqueda==null||req.query.busqueda==undefined?"":req.query.busqueda;
        var criterio = {
            $or: [
                {
                    name: {$regex: ".*" + busqueda + ".*"},

                    email: {$regex: ".*" + busqueda + ".*"}
                }
            ]
        }
        var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
            if (usuarios == null) {
                res.send("Error al listar ");
            } else {

                var pgUltima = Math.ceil(total / 4);
                var respuesta = swig.renderFile('views/bUsuarios.html', {
                    usuario: req.session.usuario,
                    usuarios: usuarios,
                    pgActual: pg,
                    pgUltima: pgUltima
                });
                res.send(respuesta);
            }
        });
    }
    );


}