'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const auth = require('firebase-auth');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.checkUserLogged = functions.https.onRequest((request,response) => {
    var user = firebase.auth().currentUser;

    if (user) {
        response.send(user);
    } else {
        response.status(403).send('Unauthorized');
    }
});