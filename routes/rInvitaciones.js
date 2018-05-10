module.exports = function (app, swig, gestorBD) {
    app.get('/sendInvitation/:email', function (req, res) {
        var invitation = {
            sender: req.session.usuario.email,
            receiver: req.params.email,
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
        gestorBD.sendInvitation(invitation, criterio, function (resultado) {
            switch (resultado) {
                case "Created":
                    res.redirect("/usuarios?mensaje=Invitacion enviada&tipoMensaje=alert-success");
                    break;
                case "Stop":
                    res.redirect("/usuarios?mensaje=Invitacion cancelada: compruebe su lista de invitaciones y amistades&tipoMensaje=alert-warning");
                    break;
                default:
                    res.redirect("/usuarios?mensaje=Fatal Error: intentar enviar invitacion&tipoMensaje=alert-danger");
                    break;
            }
        });
    });
}