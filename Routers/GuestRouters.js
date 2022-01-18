const  {Op} = require("sequelize");
const ClientWallet  = require ("../Schemas/ClientWallet");
const Message  = require ("../Schemas/Message");
const TransactionOperations = require("../Actors/TransactionOperations");
const express = require('express');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Validator = require("../Apis/DataValidator");
const {jwtPrivateKey} = require("../Apis/Config");
const Client = require("../Schemas/Client");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const {ClientWalletGlobalOperations} = require("../Actors/ClientWalletOperations");
const ClientGlobalOperations = require("../Actors/ClientOperations");
const YitAuthenticator = require("../Apis/YitAuthenticator");
const RechargeCode = require("../Schemas/RechargeCode");
const TransactionTypes = require("../Structures/TransactionTypes");
const ErrorLog = require("../Structures/ErrorLog");
const YitLogger = require("../Apis/YitLogger");
const ClientsMiddleware = require("../Apis/Middlewares/ClientsMiddleware");
const {adminName} = require("../Apis/Config");
const {RechargeCodeOperations} = require("../Actors/RechargeCodeOperations");
const {adminMail} = require("../Apis/Config");
const {adminPassword} = require("../Apis/Config");
const GuestPartnerRouter = require("../InternEndPoints/Guest/GuestPartnerRouter");
const Partner = require("../Schemas/Partner");
const SettingsMiddleware = require("../Apis/Middlewares/SettingsMiddleware");
const ClientStat = require("../Structures/ClientStat");
const MeetingRequest = require("../Schemas/MeetingRequest");

const GuestRouters = express.Router();
GuestRouters.use(async (req, res, next)=>{
    await YitAuthenticator.authAll(req, res, next)
})

//Admin Login
GuestRouters.post('/adminLogin', async (req, res) => {
    const {mail, password} = req.body;
    console.log(mail)
    console.log(password)
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
                if(bcrypt.compareSync(password, adminPassword)) {
                    const accessToken = jwt.sign({mail: mail, userType:"Admin", fullName: adminName}, jwtPrivateKey);
                    await res.json({"finalResult": true, admin: adminName, token: accessToken})
                } else {
                    res.send({'finalResult': false, 'error': 'wrong password'})
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
            let client = await Client.findOne({where: {mail: mail}})
            if(client !== null){
                ClientsMiddleware.byPassStat(client, req, res, async ()=>{
                    if(bcrypt.compareSync(password, client.hashedPassword)) {
                        const accessToken = jwt.sign({id: client.id, mail: mail, userType:"Client"}, jwtPrivateKey);
                        await res.json({"finalResult": true, token: accessToken})
                    } else {
                        res.json({finalResult: false, error: "wrong email or password"})
                    }
                })
            }else{
                res.json({finalResult: false, error: "wrong email or password"})
            }
        }catch (e){
            console.log(e)
            res.send({finalResult: false, error: e})
        }
    }
});

GuestRouters.post('/partnerLogin', async (req, res) => {
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
            let partner = await Partner.findOne({where: {mail: mail}})

            if(partner !== null){

                try{
                    if(bcrypt.compareSync(password, partner.hashedPassword)) {
                        const accessToken = jwt.sign({id: partner.id, userType:"partner"}, jwtPrivateKey);
                        await res.json({"finalResult": true, token: accessToken})
                    } else {
                        res.json({finalResult: false, error: "wrong email or password"})
                    }
                }catch (error){
                    console.log(error)
                }

            }else{
                res.json({finalResult: false, error: "wrong email or password"})
            }
        }catch (error){
            console.log(error)
            res.send({finalResult: false, error: error})
        }
    }
});

//Client SignUp
GuestRouters.post(
    '/clientSignUp',
    (req, res, next )=>{
        SettingsMiddleware("clientSignUp", true, req, res, next).then()
    },
    async (req, res) => {
    let data = req.body
    data['stat'] = ClientStat.active.value, data['type'] = 0;
    try{
        let createClientOp = await ClientGlobalOperations.create(data)
        if(createClientOp.finalResult === false){
            AnswerHttpRequest.wrong(res, createClientOp.error)
        }else {
            let client = createClientOp.result
            let wallet = await ClientWalletGlobalOperations.create(client.id)
            if(wallet !== false){
                AnswerHttpRequest.done(res, client)
            }else {
                client.destroy()
                AnswerHttpRequest.wrong(res, "Could not create user")
            }
        }
    }
    catch (e){
        console.log(e)
        AnswerHttpRequest.wrong(res, "Request failed")
    }

})

//Recharge
GuestRouters.post('/recharge', async (req, res) => {
    try{
        const {mail, hashedCode} = req.body;
        let rechargeCode = await RechargeCode.findOne({where: {hashedCode: hashedCode}})
        if(rechargeCode === null){
            AnswerHttpRequest.wrong(res, "RechargeCode unknown")
        }else {
            switch (rechargeCode.stat){
                case 0:
                    AnswerHttpRequest.wrong(res, "RechargeCode unknown")
                    break;
                case 1:
                    let client = await ClientGlobalOperations.findOne({
                        where: {
                            mail: {
                                [Op.eq]: mail
                            }
                        },
                        include : [
                            {
                                model: ClientWallet,
                                as: "Wallet",
                            }
                        ],
                    })
                    if(client === null){
                        AnswerHttpRequest.wrong(res, "client not found")
                    }else {
                        let rechargeCodeOperation = await RechargeCodeOperations.update(rechargeCode.id, {stat: 2})
                        if (rechargeCodeOperation.finalResult) {
                            let newBalance = parseInt(client["Wallet"].balance) + rechargeCode.amount
                            let walletUpdateOperation = await ClientWalletGlobalOperations.update(client["Wallet"].id, {balance: newBalance})
                            if (walletUpdateOperation.finalResult){
                                let rentTransactionsResults = await TransactionOperations.create(
                                    TransactionTypes.tickets.recharge,
                                    [
                                        {dataTitle: "clientId", dataValue: client.id},
                                        {dataTitle: "rechargeCodeId", dataValue: rechargeCode.id},
                                    ]
                                )
                                if(rentTransactionsResults.finalResult === false){
                                    let logEntry = ErrorLog.Transaction.recharge(
                                        client.id,
                                        rechargeCode.id,
                                        "Client wallet charged but transaction writes failed"
                                    )
                                    YitLogger.error({ message: logEntry})
                                }
                                AnswerHttpRequest.done(res, walletUpdateOperation.result)
                            }
                            else {
                                let logEntry = ErrorLog.WalletUpdate.recharge(
                                    client.id,
                                    rechargeCode.id,
                                    "Code accepted but client wallet not updated"
                                )
                                YitLogger.error({ message: logEntry})
                                AnswerHttpRequest.wrong(res, walletUpdateOperation.error)
                            }
                        }else {
                            AnswerHttpRequest.wrong(res, "Try again later please")
                        }
                    }
                    break;
                case 2:
                    AnswerHttpRequest.wrong(res, "RechargeCode unknown")
                    break;
                default:
                    AnswerHttpRequest.wrong(res, "blocking user")
            }
        }
    }catch (error){
        console.log(error)
        AnswerHttpRequest.wrong(res, "Request failed")
    }
});


//Client SignUp
GuestRouters.post(
    '/requestMeeting/create',
    async (req, res) => {
        try{
            let data = req.body
            data.stat = 0
            let message = await MeetingRequest.create(data);
            AnswerHttpRequest.done(res, "messages saved")
        }
        catch (e){
            console.log(e)
            AnswerHttpRequest.done(res, "request failed")
        }

    })

GuestRouters.use("/Partner",   GuestPartnerRouter)
module.exports = GuestRouters
