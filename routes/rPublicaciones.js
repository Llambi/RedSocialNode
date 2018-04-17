module.exports = function (app, swig, gestorBD) {
    app.get("/redSocial", function (req, res) {
        var criterio = {};
        if (req.query.busqueda != null) {
            criterio = {
                "nombre": {
                    $regex: ".*" + req.query.busqueda + ".*"
                }
            };
        }
        var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
            // if (usuarios == null) {
            //     res.send("Error al listar ");
            // } else {

                var pgUltima = Math.ceil(total / 4);
                var respuesta = swig.renderFile('views/bRedSocial.html', {
                    canciones: usuarios,
                    pgActual: pg,
                    pgUltima: pgUltima
                });
                res.send(respuesta);
            // }
        });
    });
}