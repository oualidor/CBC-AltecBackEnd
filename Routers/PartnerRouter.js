const express = require('express');
const ClientClientRouters = require("../InternEndPoints/Client/ClientClientRouters");
const ClientStationRouters = require("../InternEndPoints/Client/ClientStationRouters");
const YitAuthenticator = require("../Apis/YitAuthenticator");
const ClientsMiddleware = require("../Apis/Middlewares/ClientsMiddleware");
const ClientPartnerRouter = require("../InternEndPoints/Client/ClientPartnerRouter");
const PartnerMiddleware = require("../Apis/PartnerMiddleware");
const PartnerRechargeCodeRouter = require("../InternEndPoints/Partner/PartnerRechargeCodeRouter");
const PartnerPartnerRouter = require("../InternEndPoints/Partner/PartnerPartnerRouter");
const PartnerRouter = express.Router();

PartnerRouter.use((req, res, next)=>{YitAuthenticator.authAll(req, res, next).then(()=> {})})
PartnerRouter.use((req, res, next)=>{YitAuthenticator.authPartner(req, res, next)})
PartnerRouter.use((req, res, next)=> {
    PartnerMiddleware.validateExistence(req.body.id, req, res, (partner)=>{
        PartnerMiddleware.byPassStat(partner, req, res, next)
    }).then()
})

PartnerRouter.use("/Partner",   PartnerPartnerRouter)
PartnerRouter.use("/RechargeCode",   PartnerRechargeCodeRouter)

module.exports = PartnerRouter