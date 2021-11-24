const express = require('express');
const ClientClientRouters = require("../InternEndPoints/Client/ClientClientRouters");
const ClientStationRouters = require("../InternEndPoints/Client/ClientStationRouters");
const YitAuthenticator = require("../Apis/YitAuthenticator");
const ClientsMiddleware = require("../Apis/Middlewares/ClientsMiddleware");
const ClientPartnerRouter = require("../InternEndPoints/Client/ClientPartnerRouter");
const PartnerRouter = express.Router();

PartnerRouter.use((req, res, next)=>{YitAuthenticator.authAll(req, res, next).then(()=> {})})

PartnerRouter.use((req, res, next)=> {
    ClientsMiddleware.validateExistence(req.body.id, req, res, (client)=>{
        ClientsMiddleware.byPassStat(client, req, res, next)
    }).then()
})

//Station
PartnerRouter.use("/Client",   ClientClientRouters)
PartnerRouter.use("/Station",   ClientStationRouters)
PartnerRouter.use("/Partner",   ClientPartnerRouter)

module.exports = PartnerRouter