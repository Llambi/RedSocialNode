module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    borrarBBDD: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (error1, db) {
            if (error1) {
                console.log("[ERROR]: Fallo en borrado de datos #1.", error1);
                funcionCallback(null);
            } else {
                console.log("[INFO]: Borrado de datos #1: Hecho.");
                var collectionA = db.collection('amistades');
                collectionA.deleteMany({}, function (error2, result2) {
                    if (error2) {
                        console.log("[ERROR]: Fallo en borrado de datos #2: Amistades.", error2);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Borrado de datos #2: Hecho.");
                        var collectionU = db.collection('usuarios');
                        collectionU.deleteMany({}, function (error3, result3) {
                            if (error3) {
                                console.log("[ERROR]: Fallo en borrado de datos #3: Usuarios.", error3);
                                funcionCallback(null);
                            } else {
                                console.log("[INFO]: Borrado de datos: Amistades y Usuarios.");
                                funcionCallback(result3);
                            }
                        });
                    }
                    db.close();
                });
            }
        });
    },
    borrarMensajesBBDD: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (error1, db) {
            if (error1) {
                console.log("[ERROR]: Fallo en borrado de datos #1.2.", error1);
                funcionCallback(null);
            } else {
                console.log("[INFO]: Borrado de datos #3: Hecho.");
                var collection = db.collection('mensajes');
                collection.deleteMany({}, function (error2, result) {
                    if (error2) {
                        console.log("[ERROR]: Fallo en borrado de datos #4: Mensajes.", error2);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Borrado de datos: Mensajes.");
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    rellenarBBDD: function (usuarios, invitaciones, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log("[ERROR]: Fallo en relleno de datos #1.", err);
                funcionCallback(null);
            } else {
                var collectionU = db.collection('usuarios');
                collectionU.insertMany(usuarios, function (err, result) {
                    if (err) {
                        console.log("[ERROR]: Fallo en relleno de datos #2: Usuarios.", err);
                        funcionCallback(null);
                    } else {
                        var collectionA = db.collection('amistades');
                        collectionA.insertMany(invitaciones, function (err, result) {
                            if (err) {
                                console.log("[ERROR]: Fallo en relleno de datos #3: Amistades", err);
                                funcionCallback(null);
                            } else {
                                console.log("[INFO]: Relleno de datos.");
                                funcionCallback(result);
                            }
                        });
                    }
                    db.close();
                });
            }
        });
    },
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.insertOne(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
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
                console.log("[ERROR]: Fallo en el envio de invitacion.", err);
                funcionCallback("Error");
            } else {
                var collection = db.collection('amistades');
                collection.find(criterio).toArray(function (err, res) {
                    if (err) {
                        console.log("[ERROR]: Fallo en el envio de invitacion.", err);
                        funcionCallback("Error");
                    } else {
                        if (res.length > 0) {
                            console.log("[INFO]: Cancelacion de envio de invitacion.", err);
                            funcionCallback("Stop");
                        } else {
                            collection.insertOne(invitation, function (err, result) {
                                if (err) {
                                    console.log("[ERROR]: Fallo en el envio de invitacion.", err);
                                    funcionCallback("Error");
                                } else {
                                    console.log("[INFO]: Envio de invitacion.", err);
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
                console.log("[ERROR]: Fallo en la obtencion de invitaciones.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection('amistades');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, res) {
                            if (err) {
                                console.log("[ERROR]: Fallo en la obtencion de invitaciones.", err);
                                funcionCallback(null);
                            } else {
                                console.log("[INFO]: Obtencion de invitaciones.", err);
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
                console.log("[ERROR]: Fallo en la aceptacion de invitacion.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection('amistades');
                collection.updateOne(criterio, {$set: amistad}, function (err, result) {
                    if (err) {
                        console.log("[ERROR]: Fallo en la aceptacion de invitacion.", err);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Aceptacion de invitacion.", err);
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerAmigos: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get("db"), function (err, db) {
            if (err) {
                console.log("[ERROR]: Fallo en obtencion de amigos.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection("amistades");
                collection.find(criterio).toArray(function (err, amigos) {
                    if (err) {
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
    crearMensaje: function (mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log("[ERROR]: Fallo en creacion de mensaje.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.insertOne(mensaje, function (err, result) {
                    if (err) {
                        console.log("[ERROR]: Fallo en creacion de mensaje.", err);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Creacion de mensaje.");
                        funcionCallback(result);
                    }
                });

            }
        });
    },
    obtenerMensajes: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get("db"), function (err, db) {
            if (err) {
                console.log("[ERROR]: Fallo en obtencion de mensajes.", err);
                funcionCallback(null);
            } else {
                var collection = db.collection("mensajes");
                collection.find(criterio).toArray(function (err, mensajes) {
                    if (err) {
                        console.log("[ERROR]: Fallo en obtencion de mensajes.", err);
                        funcionCallback(null);
                    } else {
                        console.log("[INFO]: Obtencion de mensajes.");
                        funcionCallback(mensajes);
                    }
                })
            }
        })
    },
};