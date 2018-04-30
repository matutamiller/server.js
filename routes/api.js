const express = require('express');
const jwt = require ('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const db = 'mongodb://userMiller:loveresistant25@ds229909.mlab.com:29909/eventsdb';

mongoose.connect(db, err => {
    if(err) {
        console.error('Error!' + err);
    } else {
        console.log('Connected to mongodb');
    }
})

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorazed request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null'){
        return res.status(401).send('Unauthorazed request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload){
        return res.status(401).send('Unauthorazed request')
    }
    req.userId = payload.subject
    next()
};

router.get('/', (req, res) => {
   res.send('From API route');
});

router.post('/register', (req, res) =>{
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) => {
        if(error) {
            console.log(error);
        } else {
            let payload = { subject: registeredUser._id};
            let token = jwt.sign(payload, 'secretKey');
            res.status(200).send({token});
        }
    })
})

router.post('/login', (req, res) =>{
    let userData = req.body;
    
    User.findOne({email: userData.email}, (error, user) => {
        if(error){
            console.log(error);
        } else {
            if(!user) {
                res.status(401).send('Invalid email');
            } else
            if (user.password !== userData.password){
                res.status(401).send('Invalid password');
            } else {
                let payload = { subject: user._id};
                let token = jwt.sign(payload, 'secretKey');
                res.status(200).send({token});
            }
        }
    });
});

router.get('/events', (req, res) =>{
    let events = [
        {
            "_id": "1",
            "name": "Carnival of Venice",
            "description": "The floating city’s masked fete",
            "date": "2018-01-27T00:00:00.511Z"
        },
        {
            "_id": "2",
            "name": "Copenhagen Jazz Festival",
            "description": "Denmark’s 10-day musical feast",
            "date": "2018-02-02T00:00:00.511Z"
        },
        {
            "_id": "3",
            "name": "St Patrick’s Day",
            "description": "The feast of Saint Patrick",
            "date": "2018-03-15T00:00:00.511Z"
        },
        {
            "_id": "4",
            "name": "Keukenhof",
            "description": "Amsterdam’s Tulip Festival",
            "date": "2018-03-22T00:00:00.511Z"
        },
        {
            "_id": "5",
            "name": "Stars of the White Nights",
            "description": "St Petersburg’s annual art fair",
            "date": "2018-05-01T00:00:00.511Z"
        },
        {
            "_id": "6",
            "name": "Chelsea Flower Show",
            "description": "London’s horticultural showcase",
            "date": "2018-05-22T00:00:00.511Z"
        },
        {
            "_id": "7",
            "name": "Fiesta de San Isidro",
            "description": "Madrid’s traditional festival",
            "date": "2018-05-11T00:00:00.511Z"
        },
        {
            "_id": "8",
            "name": "Ultra Europe",
            "description": "Music festival in Split, Croatia",
            "date": "2018-06-07T00:00:00.511Z"
        },
        {
            "_id": "9",
            "name": "Sanfermines",
            "description": "Running of the bulls in Pamplona Spain",
            "date": "2018-07-06T00:00:00.511Z"
        }
    ];
    res.json(events);
});

router.get('/special', verifyToken, (req, res) =>{
    let events = [
        {
            "_id": "1",
            "name": "Berlin Beer Festival",
            "description": "Celebration of the golden drink",
            "date": "2018-08-03T00:00:00.511Z"
        },
        {
            "_id": "2",
            "name": "Oktoberfest",
            "description": "Largest folk festivals",
            "date": "2018-09-22T00:00:00.511Z"
        },
        {
            "_id": "3",
            "name": "Advent Markets",
            "description": "Christmas festivities in Vienna",
            "date": "2018-01-12T00:00:00.511Z"
        },
        {
            "_id": "4",
            "name": "Sziget Festival in Budapest",
            "description": "A weeklong rock festival",
            "date": "2018-08-08T00:00:00.511Z"
        },
        {
            "_id": "5",
            "name": "Sinterklaas Procession",
            "description": "Amsterdam’s Christmas Parade",
            "date": "2018-11-23T00:00:00.511Z"
        },
        {
            "_id": "6",
            "name": "Hogmanay",
            "description": "Edinburgh’s NYE festival",
            "date": "2018-12-31T00:00:00.511Z"
        }
    ];
    res.json(events);
});

module.exports = router;