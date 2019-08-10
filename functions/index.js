const functions = require('firebase-functions');

var admin = require("firebase-admin");

var serviceAccount = require("./credential/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reacttutorial-b34fd.firebaseio.com"
});

const express = require('express')
const app = express();

app.get('/screams',(req,res) => {
    admin.firestore().collection('screams').get().then(snapshot => {
        let screamsList = [];
        // console.log(snapshot.numChildren())
        snapshot.forEach(doc => {
            console.log(doc.data())
            screamsList.push(doc.data())

           
        })
        return res.json(screamsList)
    }).catch(err => {
        console.error(err)

    })
})

app.post('/screams', (req, res) => {
    let newScream = {
        body : req.body.body,        
        userHandle : req.body.userHandle,
        createdAt : new Date().toISOString()
    }
    admin.firestore().collection('screams').add(newScream).then((doc) => {
        res.json({message : `new Screams add Success!! id : ${doc.id}`})
    }).catch(err => {
        res.status(500).json({ messasge : `something error!`})
        console.error(err)
    })
})

exports.api = functions.https.onRequest(app);

