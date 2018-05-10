module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    borrarBBDD: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collectionA = db.collection('amistades');
                collectionA.deleteMany({}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        var collectionU = db.collection('usuarios');
                        collectionU.deleteMany({}, function (err, result) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(result);
                            }
                        });
                    }
                    db.close();
                });
            }
        });
    },
    rellenarBBDD: function (usuarios, invitaciones, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collectionU = db.collection('usuarios');
                collectionU.insertMany(usuarios, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        var collectionA = db.collection('amistades');
                        collectionA.insertMany(invitaciones, function (err, result) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(result);
                            }
                        });
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
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
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
    sendInvitation: function (invitation, criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback("Error");
            } else {
                var collection = db.collection('amistades');
                collection.find(criterio).toArray(function (err, res) {
                    if (err) {
                        funcionCallback("Error");
                    } else {
                        if (res.length > 0) {
                            funcionCallback("Stop");
                        } else {
                            collection.insertOne(invitation, function (err, result) {
                                if (err) {
                                    funcionCallback("Error");
                                } else {
                                    funcionCallback("Created");
                                }
                            })
                        }
                    }
                });
            }
        });
    },
    getInvitationsListPg: function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('amistades');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, res) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(res, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    acceptInvitation: function (criterio, amistad, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('amistades');
                collection.update(criterio, {$set: amistad}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
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