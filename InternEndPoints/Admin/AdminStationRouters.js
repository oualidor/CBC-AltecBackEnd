const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const RentTransactionGlobalRouters = require("../../Actors/TransactionOperations");

const router = express.Router();

const StationGlobalRouters = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const  AdminStationRouters = {
    create: router.post('/create', async (req, res) => {
            await StationGlobalRouters.create(req, res)
        }),

    update: router.post('/update/:id', async (req, res) => {
        let {id} = req.params
        let data = {id: req.body.id}
        let updateOp = await StationGlobalRouters.update(id, data)
        if(updateOp.finalResult){
            AnswerHttpRequest.done(res, updateOp.result)
        }else {
            AnswerHttpRequest.wrong(res, updateOp.error)
        }
    }),

    getAll: router.get('/getAll/:offset/:limit', async (req, res) => {
            await StationGlobalRouters.getAll(req, res)

        }),

    getOne: router.get('/getOne/:id', async (req, res) => {
        let {id} = req.params
        let stationGeOneOp = await StationGlobalRouters.getOne(id)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
    }),

    getOneByPublicId: router.get('/getOneByPublicId/:id', async (req, res) => {
        let {id} = req.params
        let stationGeOneOp = await StationGlobalRouters.getOneByPublicId(id)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
        }),

    getRealTimeInfo: router.get('/getRealTimeInfo/:id', async (req, res) => {
        await StationGlobalRouters.getRealTimeInfo(req, res)
    }),

    rentPowerBank: router.get('/rentPowerBank/:stationId', async (req, res) => {
        let {stationId} = req.params
        try {
            let rentResults = await StationGlobalRouters.rentPowerBank(stationId)
            res.send(rentResults)
        }catch (e){
            res.send({'finalResult': false, 'error': "Could not rent due to an error try again later"})
        }
    }),

    returnPowerBank: router.post('/returnPowerBank/', async (req, res) => {
        let {clientId, StationId, powerBankId } = req.body
        try{
            let rentTransactionsResults = await RentTransactionGlobalRouters.create(
                StationId, clientId, powerBankId,  RentTransactionTypes.return)
            res.send(rentTransactionsResults)
        }catch (e){
            console.log(e)
            res.send({'finalResult': false, 'error': e})
        }
    }),

    queryAPNNs: router.get('/queryAPNNs/:stationId/:index', async (req, res) => {
        let {stationId, index} = req.params
        try{
            let results = await StationGlobalRouters.queryAPNNs(stationId, index)
            res.send(results)
        }catch (e){
            res.send({finalResult: false, error: e})
        }
    }),
}




module.exports = AdminStationRouters;














