const express = require('express');
const TransactionTypes = require("../../Structures/TransactionTypes");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const {ClientWalletGlobalOperations} = require("../../Actors/ClientWalletOperations");
const ClientGlobalOperations = require("../../Actors/ClientOperations");
const TransactionOperations= require("../../Actors/TransactionOperations");



const StationOperations = require("../../Actors/StationOperations");
const SettingOperations = require("../../Actors/SettingOperations");
const SettingsMiddleware = require("../../Apis/SettingsMiddleware");
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
                    let rentFees = await SettingOperations.getOne("rentFees").result.dataValue
                    console.debug(rentFees)
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
                                    //TODO write log entry for transaction write failure
                                    console.log(rentTransactionsResults.error)
                                }
                                AnswerHttpRequest.done(res, "Power bank rented successfully")
                            }
                            else {
                                newBalance = newBalance + rentFees
                                await ClientWalletGlobalOperations.update(currentClient.Wallet.id, {balance: newBalance})
                                //TODO write heavy log if wallet refund fails
                                AnswerHttpRequest.wrong(res, rentResult.error)
                            }
                        }else {
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

ClientStationRouters.get('/returnPowerBank/:stationId', async (req, res) => {
    let clientId = req.body.id;
    let StationId = req.params.id;
    let powerBankId = req.body.powerBankId
    try{

        let rentTransactionsResults = await TransactionOperations.create({
            StationId, clientId, powerBankId, type: TransactionTypes.return
        })
        if(rentTransactionsResults === true){
            res.send( res.send({'finalResult': true, result: "Power bank rented successfully"}))

        }else {
            res.send( res.send({'finalResult': false, error: "power bank rented but failed to crate transaction"}))
        }

    }catch (e){
        res.send({'finalResult': false, 'error': "Could not rent due to an error try again later"})
    }
})






module.exports = ClientStationRouters;














