'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.allUsers = functions.https.onRequest((request,response) => {
    admin.firestore().collection('users').get().then(querySnapshot => {
            let listData = querySnapshot.docs.map(doc => doc.data());
            console.log(listData)
            if (listData) {
                response.send(listData);
            }
            response.send('No such users!');
        });
});

exports.createAdminUser = functions.auth.user().onCreate((user) => {  
    console.log(user);
    return admin.firestore().collection('users').doc(user.uid).set(
        {
            uid: user.uid, 
            email: user.email
        }
    );
});

exports.deleteAdminUser = functions.auth.user().onDelete((user) => {
    console.log(user);
    return admin.firestore().collection('users').doc(user.uid).delete();
});

function getActiveUsers() {
    // TODO
}
