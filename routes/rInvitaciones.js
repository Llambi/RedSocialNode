module.exports = function (app, swig, gestorBD) {
    app.get('/sendInvitation', function (req, res) {
        var invitation = {
            sender: req.session.usuario.email,
            senderName: req.session.usuario.name,
            receiver: req.query.email,
            receiverName: req.query.name,
            status: false
        };
        var criterio = {        // Se podria hacer si los estados, pero lo muestro para que se vea mejor
            $or: [
                {$and: [{sender: invitation.sender}, {receiver: invitation.receiver}, {status: false}]},  // Ya se ha enviado una invitacion previamente
                {$and: [{sender: invitation.sender}, {receiver: invitation.receiver}, {status: true}]},   // Ya son amigos
                {$and: [{sender: invitation.receiver}, {receiver: invitation.sender}, {status: false}]},  // Tiene una invitacion pediente de este usuario
                {$and: [{sender: invitation.receiver}, {receiver: invitation.sender}, {status: true}]}    // Ya son amigos
            ]
        };
        gestorBD.sendInvitation(invitation, criterio, function (result) {
            switch (result) {
                case "Created":
                    res.redirect("/usuarios?mensaje=Invitacion enviada&tipoMensaje=alert-success");
                    break;
                case "Stop":
                    res.redirect("/usuarios?mensaje=Invitacion cancelada: ya ha sido enviada previamente, " +
                        "ya es amigo de este usuario o " +
                        "este usuario le ha enviado una invitacion previamente" +
                        "&tipoMensaje=alert-warning");
                    break;
                default:
                    res.redirect("/usuarios?mensaje=Fatal Error: enviar invitacion&tipoMensaje=alert-danger");
                    break;
            }
        });
    });
    app.get("/invitations", function (req, res) {
            var pg = parseInt(req.query.pg); // Es String !!!
            if (req.query.pg == null) { // Puede no venir el param
                pg = 1;
            }
            var criterio = {
                receiver: req.session.usuario.email,
                status: false
            }
            gestorBD.getInvitationsListPg(criterio, pg, function (invitations, total) {
                if (invitations == null) {
                    res.redirect("/invitations?mensaje=Fatal Error: listar invitaciones&tipoMensaje=alert-danger");
                } else {
                    var pgUltima = Math.ceil(total / 5);
                    var respuesta = swig.renderFile('views/bInvitations.html', {
                        usuario: req.session.usuario,
                        invitations: invitations,
                        pgActual: pg,
                        pgUltima: pgUltima
                    });
                    res.send(respuesta);
                }
            });
        }
    );
    app.get('/acceptInvitation/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        var amistad = {status: true};
        gestorBD.acceptInvitation(criterio, amistad, function (result) {
            if (result == null) {
                res.redirect("/invitations?mensaje=Fatal Error: aceptar invitacion&tipoMensaje=alert-danger");
            } else {
                res.redirect("/invitations?mensaje=Peticion de amistad aceptada&tipoMensaje=alert-success");
            }
        })
    });
}