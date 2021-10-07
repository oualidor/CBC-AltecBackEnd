const express = require('express');
const RentTransaction = require("../../Schemas/Transaction");
const TransactionTypes = require("../../Structures/TransactionTypes");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const {ClientWalletGlobalOperations} = require("../../Actors/ClientWalletOperations");
const {ClientGlobalOperations} = require("../../Actors/ClientGlobalOperations");
const {RechargeCodeOperations} = require("../../Actors/RechargeCodeOperations");
const TransactionOperations= require("../../Actors/TransactionOperations");

const router = express.Router();

const StationOperations = require("../../Actors/StationOperations");
const  ClientStationRouters = {

    getAll: router.get('/getAll/:offset/:limit', async (req, res) => {
            await StationOperations.getAll(req, res)
    }),

    getOne: router.get('/getOne/:id', async (req, res) => {
            await StationOperations.getOne(req, res)
    }),

    getOneByPublicId: router.get('/getOneByPublicId/:id', async (req, res) => {
            await StationOperations.getOneByPublicId(req, res)
        }),

    getRealTimeInfo: router.get('/getRealTimeInfo/:id', async (req, res) => {
            await StationOperations.getRealTimeInfo(req, res)
    }),

    rentPowerBank: router.post('/rentPowerBank/', async (req, res) => {
        try{
            let clientId = req.body.id;
            let stationPublicId = req.body.StationId
            let clientFindOperation = await ClientGlobalOperations.findByPk(clientId)
            if(clientFindOperation.finalResult){
                //TODO Check for station type
                let stationFindOperation = await StationOperations.getOneByPublicId(stationPublicId)
                if(stationFindOperation.finalResult){
                    let currentClient = clientFindOperation.result
                    let currentBalance  = parseInt(currentClient.Wallet.balance)
                    let rentFees = 50;
                    if(currentBalance >= rentFees){
                        let newBalance = currentBalance - rentFees
                        let walletUpdateOperation = await ClientWalletGlobalOperations.update(currentClient.Wallet.id, {balance: newBalance})
                        if(walletUpdateOperation.finalResult){
                            let rentResult = await StationOperations.rentPowerBank(stationPublicId)
                            if(rentResult.finalResult === true){
                                let rentTransactionsResults = await TransactionOperations.create(
                                    TransactionTypes.station.rent,
                                    [
                                        {dataTitle: "stationId", dataValue: stationFindOperation.result.id},
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
    }),

    returnPowerBank: router.get('/returnPowerBank/:stationId', async (req, res) => {
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
    }),

}




module.exports = ClientStationRouters;














