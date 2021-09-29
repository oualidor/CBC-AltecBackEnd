const express = require('express');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminStationRouters = require("../InternEndPoints/Admin/AdminStationRouters");
const AdminClientRouters = require("../InternEndPoints/Admin/AdminClientRouters");
const AdminPartnerRouters = require("../InternEndPoints/Admin/AdminPartnerRouters");
const Validator = require("../Apis/dataValidator");
const {yitAuthenticator} = require("../Apis/yitAuthenticator");
const {jwtPrivateKey} = require("../Apis/Config");
const {adminPassword} = require("../Apis/Config");
const Client = require("../Schemas/Client");
const {ClientGlobalRouters} = require("../Actors/ClientGlobalOperations");
const clientRouter = express.Router();
//Client Login
clientRouter.post('/login', async (req, res) => {
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
                    const accessToken = jwt.sign({mail: mail, userType:"Client"}, jwtPrivateKey);
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
clientRouter.post('/create',
    async (req, res) => {
        await ClientGlobalRouters.create(req, res)
    })

clientRouter.get('/HeartBit', (req, res) =>{
    res.send({finalResult: true, result: "hi there"})
})



module.exports = {clientRouter}