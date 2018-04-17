module.exports = function (app, swig, gestorBD) {

    app.get("/signup", function (req, res) {
        var respuesta = swig.renderFile('views/bSignUp.html', {});
        res.send(respuesta);
    });

    app.post('/usuario', function (req, res) {
        if (req.body.password == req.body.rePassword) {
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var usuario = {
                email: req.body.email,
                name: req.body.name,
                password: seguro
            }
            gestorBD.insertarUsuario(usuario, function (id) {
                if (id == null) {
                    res.redirect("/signup?mensaje=Error al registrar usuario.");
                } else if (id == -1) {
                    res.redirect("/signup?mensaje=Error al registrar usuario, el email ya esta registrado en la aplicacion.");
                } else {
                    res.redirect("/login?mensaje=Nuevo usuario registrado.");
                }
            });
        }
        else {
            res.redirect("/signup?mensaje=Error al registrar usuario, las contraseñas no coinciden.");
        }
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
                req.session.usuario = usuarios[0].email;
                res.redirect("/redSocial");
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.session.usuario = null;
        res.redirect("/redsocial" +
            "?mensaje=Desconectado correctamente" +
            "&tipoMensaje=alert-success ");
    });

}