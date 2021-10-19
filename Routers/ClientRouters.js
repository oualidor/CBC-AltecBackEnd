const { Op } = require("sequelize");
const express = require('express');
const RechargeCode = require("../Schemas/RechargeCode");
const  ClientWallet  = require("../Schemas/ClientWallet");
const ClientClientRouters = require("../InternEndPoints/Client/ClientClientRouters");
const ClientStationRouters = require("../InternEndPoints/Client/ClientStationRouters");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const TransactionTypes = require("../Structures/TransactionTypes");
const TransactionOperations = require("../Actors/TransactionOperations");
const {RechargeCodeOperations} = require("../Actors/RechargeCodeOperations");
const {ClientWalletGlobalOperations} = require("../Actors/ClientWalletOperations");
const ClientGlobalOperations = require("../Actors/ClientOperations");
const YitAuthenticator = require("../Apis/YitAuthenticator");
const ClientRouter = express.Router();

ClientRouter.use((req, res, next)=>{
    YitAuthenticator.authAll(req, res, ()=>{
        YitAuthenticator.authClient(req, res, next)
    }).then(r => {})
})


//Recharge
ClientRouter.post('/recharge', async (req, res) => {
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


ClientRouter.get('/heartBit',   (req, res) =>{
    AnswerHttpRequest.done(res, "Hi there")
})


//Station
ClientRouter.use("/Station",   ClientStationRouters)
ClientRouter.use("/Client",   ClientClientRouters.getOne)




module.exports = ClientRouter