const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const TransactionOperations = require("../../Actors/TransactionOperations");

const router = express.Router();

const StationOperations = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const StatisticsOperations = require("../../Actors/StatisticsOperations");
const Station = require("../../Schemas/Station");
const Model  =require("../../Actors/_Model")
const EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
let SchemaModel = new Model(Station)
let _EndPoints = new EndPoints(Station, StationOperations, SchemaModel)

const  AdminStationRouters = {
    ready: router.use('/', _EndPoints.count),

    update: router.post('/update/:id', async (req, res) => {
        let {id} = req.params
        req.body['systemId'] = null
        let updateOp = await StationOperations.update(id, req.body)
        if(updateOp.finalResult){
            AnswerHttpRequest.done(res, updateOp.result)
        }else {
            AnswerHttpRequest.wrong(res, updateOp.error)
        }
    }),

    getOne: router.get('/getOne/:id', async (req, res) => {
        let {id} = req.params
        let stationGeOneOp = await StationOperations.getOne(id)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
    }),

    getOneByPublicId: router.get('/getOneByPublicId/:id', async (req, res) => {
        let {id} = req.params
        let stationGeOneOp = await StationOperations.getOneByPublicId(id)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
        }),

    getRealTimeInfo: router.get('/getRealTimeInfo/:id', async (req, res) => {
        await StationOperations.getRealTimeInfo(req, res)
    }),

    rentPowerBank: router.get('/rentPowerBank/:stationId', async (req, res) => {
        let {stationId} = req.params
        try {
            let rentResults = await StationOperations.rentPowerBank(stationId)
            res.send(rentResults)
        }catch (e){
            res.send({'finalResult': false, 'error': "Could not rent due to an error try again later"})
        }
    }),

    returnPowerBank: router.post('/returnPowerBank/', async (req, res) => {
        let {stationId, powerBankId } = req.body
        try{
            let metaData = [
                {dataTitle: "stationId", dataValue: stationId},
                {dataTitle: "powerBankId", dataValue: powerBankId},
            ]
            let rentTransactionsResults = await TransactionOperations.create(RentTransactionTypes.station.return, metaData)
            res.send(rentTransactionsResults)
        }catch (e){
            console.log(e)
            res.send({'finalResult': false, 'error': e})
        }
    }),

    queryAPNNs: router.get('/queryAPNNs/:stationId/:index', async (req, res) => {
        let {stationId, index} = req.params
        try{
            let results = await StationOperations.queryAPNNs(stationId, index)
            res.send(results)
        }catch (e){
            res.send({finalResult: false, error: e})
        }
    }),

    setAddress: router.post('/setAddress/:stationId', async (req, res) => {
        let {stationId} = req.params
        let point = "Station/SetServer/"+stationId
        let { address, port, heartBit }  = req.body
        let preparedData = {address, port, heartBit }
        try{
            let op = await StationOperations.sendRequest.POST(point, preparedData)
            if(op.finalResult){
                AnswerHttpRequest.done(res, op.data)
            }else {
                AnswerHttpRequest.wrong(res, op.error)
            }
        }catch (error){
            AnswerHttpRequest.wrong(res, "Request failed")
        }
    }),

    setVolume: router.get('/setVolume/:stationId/:level', async (req, res) => {
        let {stationId, level} = req.params
        let point = "Station/SetVoice/"+stationId+"/"+level
        try{
            let op = await StationOperations.sendRequest.GET(point)
            if(op.finalResult){
                AnswerHttpRequest.done(res, op.data)
            }else {
                AnswerHttpRequest.wrong(res, op.error)
            }
        }catch (error){
            AnswerHttpRequest.wrong(res, "Request failed")
        }
    }),
}




module.exports = AdminStationRouters;














