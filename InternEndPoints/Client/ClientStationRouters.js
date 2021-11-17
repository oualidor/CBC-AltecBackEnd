const express = require('express');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const {ClientWalletGlobalOperations} = require("../../Actors/ClientWalletOperations");
const ClientGlobalOperations = require("../../Actors/ClientOperations");
const TransactionOperations= require("../../Actors/TransactionOperations");
const TransactionTypes = require("../../Structures/TransactionTypes");



const StationOperations = require("../../Actors/StationOperations");
const SettingOperations = require("../../Actors/SettingOperations");
const SettingsMiddleware = require("../../Apis/Middlewares/SettingsMiddleware");
const YitLogger = require("../../Apis/YitLogger");
const ErrorLog = require("../../Structures/ErrorLog");
const  ClientStationRouters = express.Router()



ClientStationRouters.post(
    '/rentPowerBank/',
    (req, res, next)=>{
        SettingsMiddleware("rent", true, req, res, next).then()
    },
    async (req, res) => {
        try{
            let clientId = req.body.id;
            let stationPublicId = req.body.StationId
            let clientFindOperation = await ClientGlobalOperations.findByPk(clientId)
            if(clientFindOperation.finalResult){
                let stationFindOperation = await StationOperations.getOneByPublicId(stationPublicId)
                if(stationFindOperation.finalResult){
                    let currentClient = clientFindOperation.result
                    let currentBalance  = parseInt(currentClient.Wallet.balance)
                    let getFeesOp =  await SettingOperations.getOne("rentFees")
                    let rentFees = getFeesOp.result.dataValue
                    if(currentBalance >= rentFees){
                        let newBalance = currentBalance - rentFees
                        let walletUpdateOperation = await ClientWalletGlobalOperations.update(currentClient.Wallet.id, {balance: newBalance})
                        if(walletUpdateOperation.finalResult){
                            let rentResult = await StationOperations.rentPowerBank(stationPublicId)
                            if(rentResult.finalResult === true){
                                let rentTransactionsResults = await TransactionOperations.create(
                                    TransactionTypes.station.rent,
                                    [
                                        {dataTitle: "stationId", dataValue: stationFindOperation.result.systemId},
                                        {dataTitle: "clientId", dataValue: clientId},
                                        {dataTitle: "powerBankId", dataValue: rentResult.data.powerBankId},
                                    ]
                                )
                                if(rentTransactionsResults.finalResult === false){
                                    let logEntry = ErrorLog.Transaction.rent(
                                        stationFindOperation.result.id,
                                        rentResult.data.powerBankId,
                                        clientId,
                                        "Could not write transaction to DB after success rent operation"
                                    )
                                    YitLogger.error({ message: logEntry})
                                }
                                AnswerHttpRequest.done(res, "Power bank rented successfully")
                            }
                            else {
                                newBalance = newBalance + rentFees
                                await ClientWalletGlobalOperations.update(currentClient.Wallet.id, {balance: newBalance})
                                let logEntry = ErrorLog.WalletUpdate.reFund(clientId, currentBalance, "wallet refund failed after charge for rent")
                                YitLogger.error({ message: logEntry})
                                AnswerHttpRequest.wrong(res, rentResult.error)
                            }
                        }else {
                            YitLogger.error({ message: ErrorLog.WalletUpdate.rent(clientId, "charge")})
                            AnswerHttpRequest.wrong(res, walletUpdateOperation.error)
                        }
                    }else {
                        AnswerHttpRequest.wrong(res, "Insufficient balance")
                    }
                }
                else {
                    AnswerHttpRequest.wrong(res, "Unknown Station")
                }
            }else {
                AnswerHttpRequest.wrong(res, clientFindOperation.error)
            }
        }catch (error){
            AnswerHttpRequest.wrong(res, "request failed")
        }
    }
)

ClientStationRouters.get('/returnPowerBank/', async (req, res) => {
    let clientId = req.body.id;
    let StationId = req.body.StationId
    let powerBankId = req.body.powerBankId
    try{
        let rentTransactionsResults = await TransactionOperations.create({
            StationId, clientId, powerBankId, type: TransactionTypes.station.return
        })
        if(rentTransactionsResults === true){
            res.send( res.send({'finalResult': true, result: "Power bank rented successfully"}))
        }else {
            res.send( res.send({'finalResult': false, error: "power bank rented but failed to crate transaction"}))
        }
    }catch (e){
        res.send({'finalResult': false, 'error': "Request failed"})
    }
})






module.exports = ClientStationRouters;














