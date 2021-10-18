const express = require('express');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminStationRouters = require("../InternEndPoints/Admin/AdminStationRouters");
const AdminClientRouters = require("../InternEndPoints/Admin/AdminClientRouters");
const AdminPartnerRouters = require("../InternEndPoints/Admin/AdminPartnerRouters");
const AdminRechargeCodeRouters = require("../InternEndPoints/Admin/AdminRechargeCodeRouters");
const AdminRentTransactionRouter = require("../InternEndPoints/Admin/AdminTransactionRouter");
const Validator = require("../Apis/DataValidator");

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

adminRouters.use("/Station",  yitAuthenticator.authAdmin, AdminStationRouters)
adminRouters.use("/Client",  yitAuthenticator.authAdmin, AdminClientRouters.create)
adminRouters.use("/Partner",   AdminPartnerRouters.create)
adminRouters.use("/RechargeCode",   AdminRechargeCodeRouters.create)
adminRouters.use("/RentTransactions",   AdminRentTransactionRouter.create)



module.exports = {adminRouters}