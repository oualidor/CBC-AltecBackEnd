const { Op } = require("sequelize");
const express = require('express');
const RechargeCode = require("../Schemas/RechargeCode");
const  ClientWallet  = require("../Schemas/ClientWallet");
const ClientClientRouters = require("../InternEndPoints/Client/ClientClientRouters");
const ClientStationRouters = require("../InternEndPoints/Client/ClientStationRouters");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");


const {RechargeCodeOperations} = require("../Actors/RechargeCodeOperations");
const {ClientWalletGlobalOperations} = require("../Actors/ClientWalletOperations");
const ClientGlobalOperations = require("../Actors/ClientOperations");
const YitAuthenticator = require("../Apis/YitAuthenticator");
const ErrorLog = require("../Structures/ErrorLog");
const YitLogger = require("../Apis/YitLogger");
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