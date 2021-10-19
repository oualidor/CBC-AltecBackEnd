const express = require('express');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Validator = require("../Apis/DataValidator");

const {jwtPrivateKey} = require("../Apis/Config");
const Client = require("../Schemas/Client");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const {ClientWalletGlobalOperations} = require("../Actors/ClientWalletOperations");
const ClientGlobalOperations = require("../Actors/ClientOperations");
const {adminMail} = require("../Apis/Config");
const {adminPassword} = require("../Apis/Config");
const GuestRouters = express.Router();


//Admin Login
GuestRouters.post('/adminLogin', async (req, res) => {
    const {mail, password} = req.body;
    let validatedData = true;
    let dataError = "";
    if(!Validator.email(mail)){
        console.log(mail)
        validatedData = false;
        dataError = dataError+'email: wrong email';
    }
    if(!validatedData){
        res.send({'finalResult': false,  'error': dataError});
    }else{
        try {
            if(mail === adminMail){
                if(bcrypt.compareSync('16026363', adminPassword)) {
                    const accessToken = jwt.sign({mail: mail, userType:"Admin"}, jwtPrivateKey);
                    await res.json({"finalResult": true, token: accessToken})
                } else {
                    // Passwords don't match
                }
            }else {
                await res.json({'finalResult': false, 'error': "wrong email or password"})
            }
        }catch(error){
            res.send({'finalResult': false,  'error': error})
        }
    }
});

//Client Login
GuestRouters.post('/clientLogin', async (req, res) => {
    const {mail, password} = req.body;
    let validatedData = true;
    let dataError = "";
    if(!Validator.email(mail)){
        console.log(mail)
        validatedData = false;
        dataError = dataError+'email: wrong email';
    }
    if(!Validator.password(password)){
        console.log("wrong")
        console.log(mail)
        validatedData = false;
        dataError = dataError+' pass: mal password';
    }
    if(!validatedData){
        res.send({'finalResult': false,  'error': dataError});
    }else{
        try{
            let clients = await Client.findAll(
                {
                    where: {
                        mail: mail
                    }
                })
            if(clients.length > 0){
                let client = clients[0]
                if(bcrypt.compareSync(password, client.hashedPassword)) {
                    const accessToken = jwt.sign({id: client.id, mail: mail, userType:"Client"}, jwtPrivateKey);
                    await res.json({"finalResult": true, token: accessToken})
                } else {
                    res.json({finalResult: false, error: "wrong email or password"})
                }
            }else{
                res.json({finalResult: false, error: "wrong email or password"})
            }
        }catch (e){
            console.log(e)
            res.send({finalResult: false, error: e})
        }
    }
});

//Client SignUp
GuestRouters.post('/clientSignUp', async (req, res) => {
    let data = req.body
    let gor = await ClientGlobalOperations.create(data)
    if(gor.finalResult === false){
        AnswerHttpRequest.wrong(res, gor.error)
    }else {
        let client = gor.result
        let wallet = ClientWalletGlobalOperations.create(client.id)
        if(wallet !== false){
            AnswerHttpRequest.done(res, client)
        }else {
            client.destroy()
            AnswerHttpRequest.wrong(res, "Could not create user")
        }
        AnswerHttpRequest.done(res, client)
    }
})


module.exports = GuestRouters