const express = require('express');
const AdminStationRouters = require("../InternEndPoints/Admin/AdminStationRouters");
const AdminClientRouters = require("../InternEndPoints/Admin/AdminClientRouters");
const AdminPartnerRouters = require("../InternEndPoints/Admin/AdminPartnerRouters");
const AdminRechargeCodeRouters = require("../InternEndPoints/Admin/AdminRechargeCodeRouters");
const AdminRentTransactionRouter = require("../InternEndPoints/Admin/AdminTransactionRouter");
const AdminSettingRouter = require("../InternEndPoints/Admin/AdminSettingRouter");
const YitAuthenticator = require("../Apis/YitAuthenticator");

const AdminRouters = express.Router();

AdminRouters.use((req, res, next)=>{
    YitAuthenticator.authAdmin(req, res, next)
})

AdminRouters.use("/Station", AdminStationRouters)
AdminRouters.use("/Client", AdminClientRouters)
AdminRouters.use("/Partner", AdminPartnerRouters)
AdminRouters.use("/RechargeCode", AdminRechargeCodeRouters.create)
AdminRouters.use("/RentTransactions", AdminRentTransactionRouter)
AdminRouters.use("/Setting", AdminSettingRouter)



module.exports = AdminRouters