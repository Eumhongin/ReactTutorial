const functions = require('firebase-functions');

var admin = require("firebase-admin");

var serviceAccount = require("./credential/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://reacttutorial-b34fd.firebaseio.com"
});

const express = require('express')
const app = express();

var firebaseConfig = {
    apiKey: "AIzaSyB6Qdj8fLWRNDExBiu2D8ior08eZbf5ukU",
    authDomain: "reacttutorial-b34fd.firebaseapp.com",
    databaseURL: "https://reacttutorial-b34fd.firebaseio.com",
    projectId: "reacttutorial-b34fd",
    storageBucket: "reacttutorial-b34fd.appspot.com",
    messagingSenderId: "603219522889",
    appId: "1:603219522889:web:20443561b9f5ebe9"
};

const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)


const db = admin.firestore();

app.get('/screams', (req, res) => {
    db.collection('screams').orderBy('createdAt', 'desc').get().then(snapshot => {
        let screamsList = [];
        // console.log(snapshot.numChildren())
        snapshot.forEach(doc => {
            // console.log(doc.data())
            screamsList.push(doc.data())


        })
        return res.json(screamsList)
    }).catch(err => {
        console.error(err)

    })
})

app.post('/screams', (req, res) => {
    let newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    }
    db.collection('screams').add(newScream).then((doc) => {
        res.json({
            message: `new Screams add Success!! id : ${doc.id}`
        })
    }).catch(err => {
        res.status(500).json({
            messasge: `something error!`
        })
        console.error(err)
    })
})
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
}
const isEmpty = (string) => {
    if (string.trim() === '') {
        return true
    } else {
        return false
    }
}

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    let errors = {}
    if (isEmpty(newUser.email)) {
        errors.email = 'Must not be empty'
    } else if (!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address'
    }


    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'passwords must match';
    if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

    if(Object.keys(errors).length > 0) return res.status(400).json({errors});


    // TODO : validate data
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({
                    handle: `this handle us already taken`
                })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)

            }
        })
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken();
            //const userId = data.user.uid;

        })
        .then(idtoken => {

            token = idtoken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({
                token
            });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({
                    email: 'This Email was already used'
                })
            } else {
                return res.status(500).json({
                    error: err.code
                })
            }

        })

    // firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
    // .then(data => {
    //     return res.status(201).json({message :`user ${data.user.uid} sign up successfully`})
    // })
    // .catch(err => {
    //     console.error(err)
    //     return res.status(500).json({
    //         err : err.code
    //     })
    // })
})

exports.api = functions.region('asia-east2').https.onRequest(app);