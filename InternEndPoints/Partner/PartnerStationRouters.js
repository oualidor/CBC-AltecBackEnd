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
const StationMiddleware = require("../../Apis/Middlewares/StationMiddleware");
const PartnerStates = require("../../Structures/PartnerStates");
const  PartnerStationRouters = express.Router()


PartnerStationRouters.use(
    (req, res, next) =>{
        let stationPublicId = req.body.StationId
        StationMiddleware.validateExistence(stationPublicId, req, res, next).then()
    }
)

PartnerStationRouters.use(
    (req, res, next) =>{
        StationMiddleware.byPassStat(req['station'], req, res, next)
    }
)

PartnerStationRouters.get('/getRealTimeInfo/', async (req, res) => {
    await StationOperations.getRealTimeInfo(req, res)
}),

PartnerStationRouters.post(
    '/rentPowerBank/',
    (req, res, next)=>{
        SettingsMiddleware("rent", true, req, res, next).then()
    },
    async (req, res) => {
        try{
            let partner = req.body.client
            if(partner.type === PartnerStates.trusted.id){
                let stationPublicId = req.body.StationId
                let currentStation = req.station
                    let rentResult = await StationOperations.rentPowerBank(stationPublicId)
                    if(rentResult.finalResult === true){
                        let rentTransactionsResults = await TransactionOperations.create(
                            TransactionTypes.station.rent,
                            [
                                {dataTitle: "stationId", dataValue: currentStation.systemId},
                                {dataTitle: "partnerId", dataValue: partner.id},
                                {dataTitle: "powerBankId", dataValue: rentResult.data.powerBankId},

                            ]
                        )
                        if(rentTransactionsResults.finalResult === false){
                            let partnerId = partner.id
                            let logEntry = ErrorLog.Transaction.rent(
                                currentStation.id,
                                rentResult.data.powerBankId,
                                partnerId,
                                "Could not write transaction to DB after success rent operation by a trusted partner"
                            )
                            YitLogger.error({ message: logEntry})
                        }
                        partner.update({type: 0})
                        AnswerHttpRequest.done(res, "Power bank rented successfully")
                    }
                    else {
                        newBalance = newBalance + rentFees
                        await ClientWalletGlobalOperations.update(currentClient['Wallet'].id, {balance: newBalance})
                        let logEntry = ErrorLog.WalletUpdate.reFund(clientId, currentBalance, "wallet refund failed after charge for rent")
                        YitLogger.error({ message: logEntry})
                        AnswerHttpRequest.wrong(res, rentResult.error)
                    }

            }else {
                AnswerHttpRequest.wrong(res, "you already have power bank")
            }
        }catch (error){
            console.log(error)
            AnswerHttpRequest.wrong(res, "Request failed")
        }
    }
)






module.exports = PartnerStationRouters;














