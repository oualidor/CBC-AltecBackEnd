const express = require('express');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminStationRouters = require("../InternEndPoints/Admin/AdminStationRouters");
const AdminClientRouters = require("../InternEndPoints/Admin/AdminClientRouters");
const AdminPartnerRouters = require("../InternEndPoints/Admin/AdminPartnerRouters");
const Validator = require("../Apis/DataValidator");
const AdminRechargeCodeRouters = require("../InternEndPoints/Admin/AdminRechargeCodeRouters");
const AdminRentTransactionRouter = require("../InternEndPoints/Admin/AdminTransactionRouter");
const EndPoints = require("../InternEndPoints/Admin/_EndPoints");
const Station = require("../Schemas/Station");
const StationOperations = require("../Actors/StationOperations");
const {yitAuthenticator} = require("../Apis/yitAuthenticator");
const {jwtPrivateKey} = require("../Apis/Config");
const {adminPassword} = require("../Apis/Config");
const {adminMail} = require("../Apis/Config");
const adminRouters = express.Router();
//Admin Login
adminRouters.post('/login', async (req, res) => {
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
let _EndPoints = new EndPoints(Station, StationOperations)
adminRouters.use("/Station",  yitAuthenticator.authAdmin, AdminStationRouters.create)
adminRouters.use("/Station",  yitAuthenticator.authAdmin, _EndPoints.count)
adminRouters.use("/Client",  yitAuthenticator.authAdmin, AdminClientRouters.create)
adminRouters.use("/Partner",   AdminPartnerRouters.create)
adminRouters.use("/RechargeCode",   AdminRechargeCodeRouters.create)
adminRouters.use("/RentTransactions",   AdminRentTransactionRouter.create)



module.exports = {adminRouters}