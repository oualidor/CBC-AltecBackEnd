const express = require('express');
const ClientClientRouters = require("../InternEndPoints/Client/ClientClientRouters");
const ClientStationRouters = require("../InternEndPoints/Client/ClientStationRouters");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const YitAuthenticator = require("../Apis/YitAuthenticator");
const ClientRouter = express.Router();

ClientRouter.use((req, res, next)=>{
    YitAuthenticator.authAll(req, res, ()=>{
        YitAuthenticator.authClient(req, res, next)
    }).then(()=> {})
})

ClientRouter.get('/heartBit',   (req, res) =>{
    AnswerHttpRequest.done(res, "Hi there")
})


//Station
ClientRouter.use("/Station",   ClientStationRouters)
ClientRouter.use("/Client",   ClientClientRouters.getOne)




module.exports = ClientRouter