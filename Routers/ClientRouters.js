const express = require('express');
const ClientClientRouters = require("../InternEndPoints/Client/ClientClientRouters");
const ClientStationRouters = require("../InternEndPoints/Client/ClientStationRouters");
const YitAuthenticator = require("../Apis/YitAuthenticator");
const ClientsMiddleware = require("../Apis/Middlewares/ClientsMiddleware");
const ClientPartnerRouter = require("../InternEndPoints/Client/ClientPartnerRouter");
const ClientRouter = express.Router();

ClientRouter.use((req, res, next)=>{YitAuthenticator.authAll(req, res, next).then(()=> {})})
ClientRouter.use((req, res, next)=>{YitAuthenticator.authClient(req, res, next)})

ClientRouter.use((req, res, next)=> {
    ClientsMiddleware.validateExistence(req.body.id, req, res, (client)=>{
        ClientsMiddleware.byPassStat(client, req, res, next)
    }).then()
})

//Station
ClientRouter.use("/Client",   ClientClientRouters)
ClientRouter.use("/Station",   ClientStationRouters)
ClientRouter.use("/Partner",   ClientPartnerRouter)





module.exports = ClientRouter