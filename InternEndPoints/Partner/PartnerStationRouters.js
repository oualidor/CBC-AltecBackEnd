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
        StationMiddleware.validateExistence(req, res, next).then()
    }
)

PartnerStationRouters.use(
    (req, res, next) =>{
        StationMiddleware.byPassStat(req['station'], req, res, next)
    }
)

PartnerStationRouters.get('/getRealTimeInfo/', async (req, res) => {
    try{
        let stationPublicId = req.station.id
        let op = await StationOperations.getRealTimeInfo(stationPublicId)
        if(op.finalResult){
            AnswerHttpRequest.done(res, op.result)
        }else {
            AnswerHttpRequest.wrong(res, op.error)
        }
    }catch (error){
        AnswerHttpRequest.wrong(res, "Request failed")

    }
}),

PartnerStationRouters.post(
    '/rentPowerBank/',
    (req, res, next)=>{
        SettingsMiddleware("rent", true, req, res, next).then()
    },
    async (req, res) => {
        try{
            let partner = req.body.partner
            console.log(partner.stat)
            if(partner.stat === PartnerStates.trusted.id){
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
                        AnswerHttpRequest.wrong(res, rentResult.error)
                    }

            }else {
                AnswerHttpRequest.wrong(res, "You are not allowed to rent power banks")
            }
        }catch (error){
            console.log(error)
            AnswerHttpRequest.wrong(res, "Request failed")
        }
    }
)






module.exports = PartnerStationRouters;














