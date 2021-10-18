const { Op } = require("sequelize");
const express = require('express');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RechargeCode = require("../Schemas/RechargeCode");
const  ClientWallet  = require("../Schemas/ClientWallet");
const Validator = require("../Apis/DataValidator");
const {yitAuthenticator} = require("../Apis/yitAuthenticator");
const {jwtPrivateKey} = require("../Apis/Config");
const Client = require("../Schemas/Client");
const ClientClientRouters = require("../InternEndPoints/Client/ClientClientRouters");
const ClientStationRouters = require("../InternEndPoints/Client/ClientStationRouters");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const TransactionTypes = require("../Structures/TransactionTypes");
const TransactionOperations = require("../Actors/TransactionOperations");
const {RechargeCodeOperations} = require("../Actors/RechargeCodeOperations");
const {ClientWalletGlobalOperations} = require("../Actors/ClientWalletOperations");
const ClientGlobalOperations = require("../Actors/ClientOperations");
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
                    const accessToken = jwt.sign({id: client.id, mail: mail, userType:"Client"}, jwtPrivateKey);
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
clientRouter.post('/create', async (req, res) => {
    let data = req.body
    let gor = await ClientGlobalOperations.create(data)
    if(gor.finalResult === false){
        AnswerHttpRequest.wrong(res, gor.error)
    }else {
        let client = gor.result
        let wallet = ClientWalletGlobalOperations.create(client.id)
        if(wallet != false){
            AnswerHttpRequest.done(res, client)
        }else {
            client.destroy()
            AnswerHttpRequest.wrong(res, "Could not create user")
        }
        AnswerHttpRequest.done(res, client)
    }
})


//Recharge
clientRouter.post('/recharge', async (req, res) => {
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
                            let newBalance = parseInt(client.Wallet.balance) + rechargeCode.amount
                            let walletUpdateOperation = await ClientWalletGlobalOperations.update(client.Wallet.id, {balance: newBalance})
                            if (walletUpdateOperation.finalResult) {
                                let rentTransactionsResults = await TransactionOperations.create(
                                    TransactionTypes.tickets.recharge,
                                    [
                                        {dataTitle: "clientId", dataValue: client.id},
                                        {dataTitle: "rechargeCodeId", dataValue: rechargeCode.id},
                                    ]
                                )
                                if(rentTransactionsResults.finalResult === false){
                                    //TODO treat wallet updated transaction no created
                                }
                                AnswerHttpRequest.done(res, walletUpdateOperation.result)
                            }else {
                                //TODO treat code accepted wallet not updated
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


clientRouter.get('/heartBit',  yitAuthenticator.authClient, (req, res) =>{
    AnswerHttpRequest.done(res, "Hi there")
})


//Station
clientRouter.use("/Station",  yitAuthenticator.authClient, ClientStationRouters.getOne)
clientRouter.use("/Client",  yitAuthenticator.authClient, ClientClientRouters.getOne)




module.exports = {clientRouter}