const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')
admin.initializeApp()

const app = express();

var config = {
    apiKey: "AIzaSyB6Qdj8fLWRNDExBiu2D8ior08eZbf5ukU",
    authDomain: "reacttutorial-b34fd.firebaseapp.com",
    databaseURL: "https://reacttutorial-b34fd.firebaseio.com",
    projectId: "reacttutorial-b34fd",
    storageBucket: "reacttutorial-b34fd.appspot.com",
    messagingSenderId: "603219522889",
    appId: "1:603219522889:web:20443561b9f5ebe9"
};


const firebase = require('firebase')
firebase.initializeApp(config)

app.get('/screams',(req,res) => {
    
})

app.post('/screams', (req, res) => {

})

exports.api = functions.https.onRequest(app);

