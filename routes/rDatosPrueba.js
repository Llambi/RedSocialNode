module.exports = function (app, swig, gestorBD) {
    app.get("/borrarBBDD", function (req, res) {
        gestorBD.borrarBBDD(function (resultado) {
            if (resultado == null) {
                res.redirect("/?mensaje=Fatal Error: borrar base datos&tipoMensaje=alert-danger");
            } else {
                res.redirect("/?mensaje=Base de datos vaciada&tipoMensaje=alert-info");
            }
        });
    });
    app.get("/rellenarBBDD", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update("123").digest('hex');
        var usuarios = [
            {"name": "Jose", "email": "jose@hotmail.es", "password": seguro},
            {"name": "Hugo", "email": "hugo@hotmail.es", "password": seguro},
            {"name": "Alberto", "email": "alberto@hotmail.es", "password": seguro},
            {"name": "Sofia", "email": "sofia@hotmail.es", "password": seguro},
            {"name": "Juan", "email": "juan@hotmail.es", "password": seguro},
            {"name": "Rosa", "email": "rosa@hotmail.es", "password": seguro},
            {"name": "Carmen", "email": "carmen@hotmail.es", "password": seguro},
            {"name": "Pelayo", "email": "pelayo@hotmail.es", "password": seguro},
        ];
        var invitaciones = [
            {
                sender: "jose@hotmail.es",
                senderName: "Jose",
                receiver: "hugo@hotmail.es",
                receiverName: "Hugo",
                status: true
            },
            {
                sender: "jose@hotmail.es",
                senderName: "Jose",
                receiver: "sofia@hotmail.es",
                receiverName: "Sofia",
                status: true
            },
            {
                sender: "jose@hotmail.es",
                senderName: "Jose",
                receiver: "carmen@hotmail.es",
                receiverName: "Carmen",
                status: false
            },
            {
                sender: "pelayo@hotmail.es",
                senderName: "Pelayo",
                receiver: "hugo@hotmail.es",
                receiverName: "Hugo",
                status: true
            },
            {
                sender: "pelayo@hotmail.es",
                senderName: "Pelayo",
                receiver: "jose@hotmail.es",
                receiverName: "Jose",
                status: true
            },
            {
                sender: "alberto@hotmail.es",
                senderName: "Alberto",
                receiver: "jose@hotmail.es",
                receiverName: "Jose",
                status: false
            },
            {
                sender: "alberto@hotmail.es",
                senderName: "Alberto",
                receiver: "hugo@hotmail.es",
                receiverName: "Hugo",
                status: false
            },
            {
                sender: "alberto@hotmail.es",
                senderName: "Alberto",
                receiver: "sofia@hotmail.es",
                receiverName: "Sofia",
                status: false
            },
            {
                sender: "alberto@hotmail.es",
                senderName: "Alberto",
                receiver: "juan@hotmail.es",
                receiverName: "Juan",
                status: false
            },
            {
                sender: "alberto@hotmail.es",
                senderName: "Alberto",
                receiver: "carmen@hotmail.es",
                receiverName: "Carmen",
                status: false
            },
            {
                sender: "alberto@hotmail.es",
                senderName: "Alberto",
                receiver: "pelayo@hotmail.es",
                receiverName: "Pelayo",
                status: false
            },
			{
                sender: "rosa@hotmail.es",
                senderName: "Rosa",
                receiver: "jose@hotmail.es",
                receiverName: "Jose",
                status: true
            },
            {
                sender: "rosa@hotmail.es",
                senderName: "Rosa",
                receiver: "hugo@hotmail.es",
                receiverName: "Hugo",
                status: true
            },
            {
                sender: "rosa@hotmail.es",
                senderName: "Rosa",
                receiver: "sofia@hotmail.es",
                receiverName: "Sofia",
                status: true
            },
            {
                sender: "rosa@hotmail.es",
                senderName: "Rosa",
                receiver: "juan@hotmail.es",
                receiverName: "Juan",
                status: true
            },
            {
                sender: "rosa@hotmail.es",
                senderName: "Rosa",
                receiver: "alberto@hotmail.es",
                receiverName: "Alberto",
                status: true
            },
            {
                sender: "rosa@hotmail.es",
                senderName: "Rosa",
                receiver: "carmen@hotmail.es",
                receiverName: "Carmen",
                status: true
            },
            {
                sender: "rosa@hotmail.es",
                senderName: "Rosa",
                receiver: "pelayo@hotmail.es",
                receiverName: "Pelayo",
                status: true
            },

        ];
        gestorBD.rellenarBBDD(usuarios, invitaciones, function (resultado) {
            if (resultado == null) {
                res.redirect("/?mensaje=Fatal Error: rellenar base datos&tipoMensaje=alert-danger");
            } else {
                res.redirect("/?mensaje=Base de datos rellenada&tipoMensaje=alert-info");
            }
        });
    });
}