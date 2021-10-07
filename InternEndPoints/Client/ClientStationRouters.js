const express = require('express');
const RentTransaction = require("../../Schemas/Transaction");
const RentTransactionTypes = require("../../Structures/RentTransactionTypes");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const {ClientWalletGlobalOperations} = require("../../Actors/ClientWalletOperations");
const {ClientGlobalOperations} = require("../../Actors/ClientGlobalOperations");
const {RechargeCodeOperations} = require("../../Actors/RechargeCodeOperations");
const TransactionOperations= require("../../Actors/TransactionOperations");

const router = express.Router();

const {StationGlobalRouters} = require("../../Actors/StationGlobalOperatios");
const  ClientStationRouters = {

    getAll: router.get('/getAll/:offset/:limit', async (req, res) => {
            await StationGlobalRouters.getAll(req, res)
    }),

    getOne: router.get('/getOne/:id', async (req, res) => {
            await StationGlobalRouters.getOne(req, res)
    }),

    getOneByPublicId: router.get('/getOneByPublicId/:id', async (req, res) => {
            await StationGlobalRouters.getOneByPublicId(req, res)
        }),

    getRealTimeInfo: router.get('/getRealTimeInfo/:id', async (req, res) => {
            await StationGlobalRouters.getRealTimeInfo(req, res)
    }),

    rentPowerBank: router.post('/rentPowerBank/', async (req, res) => {
        try{
            let clientId = req.body.id;
            let StationId = req.body.StationId
            let gor = await ClientGlobalOperations.findByPk(clientId)
            if(gor.finalResult){
                //TODO Check for station type
                if(false){

                }else {
                    let currentClient = gor.result
                    let currentBalance  = parseInt(currentClient.Wallet.balance)
                    let rentFees = 50;
                    if(currentBalance >= rentFees){
                        let newBalance = currentBalance - rentFees
                        let gor = await ClientWalletGlobalOperations.update(currentClient.Wallet.id, {balance: newBalance})
                        if(gor.finalResult){
                            let rentResult = await StationGlobalRouters.rentPowerBank(StationId)
                            if(rentResult.finalResult === true){
                                let rentTransactionsResults = await TransactionOperations.create(
                                    RentTransactionTypes.rent,
                                    [
                                        {dataTitle: "stationId", dataValue: StationId},
                                        {dataTitle: "clientId", dataValue: clientId},
                                        {dataTitle: "powerBankId", dataValue: rentResult.data.powerBankId},
                                    ]
                                )
                                if(rentTransactionsResults.finalResult === true){
                                    AnswerHttpRequest.done(res, "Power bank rented successfully")
                                }else {
                                    //TODO write log entry for transaction write failure
                                    console.log(rentTransactionsResults.error)
                                    AnswerHttpRequest.wrong(res, "power bank rented but failed to crate transaction")
                                }
                            }else {
                                newBalance = newBalance + rentFees
                                let gor = await ClientWalletGlobalOperations.update(currentClient.Wallet.id, {balance: newBalance})
                                //TODO write heavy log if wallet refund fails
                                AnswerHttpRequest.wrong(res, "Could not rent the power bank")
                            }
                        }else {
                            AnswerHttpRequest.wrong(res, gor.error)
                        }
                    }else {
                        AnswerHttpRequest.wrong(res, "Insufficient balance")
                    }
                }
            }else {
                AnswerHttpRequest.wrong(res, gor.error)
            }
        }catch (e){
            AnswerHttpRequest.wrong(res, "request failed")
        }
    }),

    returnPowerBank: router.get('/returnPowerBank/:stationId', async (req, res) => {
        let clientId = req.body.id;
        let StationId = req.params.id;
        let powerBankId = req.body.powerBankId
        try{

            let rentTransactionsResults = await TransactionOperations.create({
                StationId, clientId, powerBankId, type: RentTransactionTypes.return
            })
            if(rentTransactionsResults === true){
                res.send( res.send({'finalResult': true, result: "Power bank rented successfully"}))

            }else {
                res.send( res.send({'finalResult': false, error: "power bank rented but failed to crate transaction"}))
            }

        }catch (e){
            res.send({'finalResult': false, 'error': "Could not rent due to an error try again later"})
        }
    }),

}




module.exports = ClientStationRouters;














