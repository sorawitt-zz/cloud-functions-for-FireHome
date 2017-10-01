// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.database()
/*
exports.fanOpen = functions.database.ref('/Home/{homeId}/sensors/temperature').onUpdate(event => {
    const homeID = event.params.homeId;
    const temperature = event.data.val();
    return database.ref('Home').child(`/${homeID}/devices/fan/status`).set(checkTemp(temperature))


})

exports.fanOpen = functions.database.ref('/Home/{homeId}/sensors/temperature').onUpdate(event => {
    const homeID = event.params.homeId;
    const temperature = event.data.val();
    const lampState = event.data.current.child('manualStatus').val();
    if(lampState == 1){
        return database.ref('Home').child(`/${homeID}/devices/fan/status`).set(1)
    }else
    return database.ref('Home').child(`/${homeID}/devices/fan/status`).set(checkLight(temperature))


})*/


exports.fanOpen = functions.database.ref('/Home/{homeId}/sensors/temperature').onUpdate(event => {
    const homeID = event.params.homeId;
    const temperature = event.data.val();


    database.ref('Home').child("users").child('FCM').once('value', function(snapshot) {
        const fcm = snapshot.val()
        if(temperature>100){
            sendNotification(fcm)
        }
    });

    database.ref('Home').child(homeID).child('devices/fan/manualStatus').once('value', function(snapshot) {
        const stateee = snapshot.val()
        if(stateee == 1){
            return database.ref('Home').child(`/${homeID}/devices/fan/status`).set(1)
        }else
        return database.ref('Home').child(`/${homeID}/devices/fan/status`).set(checkLight(brightness))
    });


    //const lampState = event.data.previous.child('devices/lamp/manualStatus').val();
    


})

function checkTemp(tempVal){
    if(tempVal > 28 && tempVal <30){
        return 1
    }
    return 0
}



exports.lampOpen = functions.database.ref('/Home/{homeId}/sensors/brightness').onUpdate(event => {
    const homeID = event.params.homeId;
    const brightness = event.data.val();

 

    database.ref('Home').child(homeID).child('devices/lamp/manualStatus').once('value', function(snapshot) {
        const stateee = snapshot.val()
        if(stateee == 1){
            return database.ref('Home').child(`/${homeID}/devices/lamp/status`).set(1)
        }else
        return database.ref('Home').child(`/${homeID}/devices/lamp/status`).set(checkLight(brightness))
    });


    //const lampState = event.data.previous.child('devices/lamp/manualStatus').val();
    


})



function checkLight(val){
    if(val < 60){
        return 1
    }
    return 0
}


exports.setManualLight = functions.database.ref('/Home/{homeId}/manual').onUpdate(event => {
    const homeID = event.params.homeId;
    const val = event.data.val();
    if(val == 1){
        return database.ref('Home').child(`/${homeID}/devices/lamp/manualStatus`).set(0)
    }else    return database.ref('Home').child(`/${homeID}/devices/lamp/manualStatus`).set(1)


})

exports.setManualLight1 = functions.database.ref('/Home/{homeId}/manual').onUpdate(event => {
    const homeID = event.params.homeId;
    const val = event.data.val();
    if(val == 1){
    return database.ref('Home').child(`/${homeID}/devices/fan/manualStatus`).set(0)
    }else  return database.ref('Home').child(`/${homeID}/devices/lamp/manualStatus`).set(1)

})


function sendNotification(regisToken){
    var payload = {
        notification: {
        title : "Warning",
        body : "Burningggggg",
        bage: "0"
    }};
    admin.messaging().sendToDevice(regisToken, payload)
}