'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.checkUserLogged = functions.https.onRequest((request,response) => {
    var result = getActiveUsers();
    response.send(result);
});

async function getInactiveUsers(users = [], nextPageToken) {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    // Find users that have not signed in in the last 30 days.
    const inactiveUsers = result.users.filter(
        user => Date.parse(user.metadata.lastSignInTime) < (Date.now() - 30 * 24 * 60 * 60 * 1000));

    // Concat with list of previously found inactive users if there was more than 1000 users.
    users = users.concat(inactiveUsers);

    // If there are more users to fetch we fetch them.
    if (result.pageToken) {
        return getInactiveUsers(users, result.pageToken);
    }

    return users;
}

async function getActiveUsers(users = [], nextPageToken) {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    // Find users that have not signed in in the last 30 days.
    const inactiveUsers = result.users.filter(
        user => Date.parse(user.metadata.lastSignInTime) > (Date.now() - 30 * 24 * 60 * 60 * 1000));

    // Concat with list of previously found inactive users if there was more than 1000 users.
    users = users.concat(inactiveUsers);

    // If there are more users to fetch we fetch them.
    if (result.pageToken) {
    return getInactiveUsers(users, result.pageToken);
    }

    return users;
}