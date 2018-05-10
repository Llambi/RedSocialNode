module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log("[ERROR]: Fallo en insercion de usuario.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.insertOne(usuario, function (err, result) {
                    if (err) {
                        console.log("[ERROR]: Fallo en insercion de usuario.", err);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Insercion de usuario.");
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuarios: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log("[ERROR]: Fallo en obtencion de usuarios.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        console.log("[ERROR]: Fallo en obtencion de usuarios.", err);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Obtencion de usuarios.");
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuariosPg: function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log("[ERROR]: Fallo en obtencion de usuarios.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 4).limit(4)
                        .toArray(function (err, usuarios) {
                            if (err) {
                                console.log("[ERROR]: Fallo en obtencion de usuarios.", err);
                                funcionCallback(null);
                            } else {
                                console.log("[INFO]: Obtencion de usuarios.");
                                funcionCallback(usuarios, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    obtenerAmigos: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get("db"), function (err, db) {
            if (err){
                console.log("[ERROR]: Fallo en obtencion de amigos.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection("amistad");
                collection.find(criterio).toArray(function (err, amigos) {
                    if (err){
                        console.log("[ERROR]: Fallo en obtencion de amigos.", err);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Obtencion de amigos.");
                        funcionCallback(amigos);
                    }
                })
            }
        })
    },
};