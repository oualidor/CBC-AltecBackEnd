const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const TransactionOperations = require("../../Actors/TransactionOperations");
const StationOperations = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const Station = require("../../Schemas/Station");
const Transaction = require("../../Schemas/Transaction");
const Client = require("../../Schemas/Client");
const TransactionMetaData = require("../../Schemas/TransactionMetaData");
const _EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
const {Op} = require("sequelize");

const AdminStationRouters = express.Router();

AdminStationRouters.get('/getOne/:id', async (req, res) => {
    let {id} = req.params
    let stationGeOneOp = await StationOperations.getOne(id)
    if(stationGeOneOp.finalResult){
        AnswerHttpRequest.done(res, stationGeOneOp.result)
    }
    else{
        AnswerHttpRequest.wrong(res, stationGeOneOp.error)
    }
}),

AdminStationRouters.get('/getOneByPublicId/:id', async (req, res) => {
    let {id} = req.params
    let stationGeOneOp = await StationOperations.getOneByPublicId(id)
    if(stationGeOneOp.finalResult){
        AnswerHttpRequest.done(res, stationGeOneOp.result)
    }
    else{
        AnswerHttpRequest.wrong(res, stationGeOneOp.error)
    }
    }),

AdminStationRouters.get('/getRealTimeInfo/:id', async (req, res) => {
    try{
        let stationPublicId = req.params.id
        let op = await StationOperations.getRealTimeInfo(stationPublicId)
        //console.log(op)
        if(op.finalResult){
            // res.send({finalResult: true, data: op.result.data})
            if(op.finalResult){
                AnswerHttpRequest.done(res, op.data)
            }else {
                AnswerHttpRequest.wrong(res, op.result)
            }
        }else {
            AnswerHttpRequest.wrong(res, op.error)
        }
    }catch (error){
        console.log(error)
        AnswerHttpRequest.wrong(res, "Request failed")

    }
}),

AdminStationRouters.get('/rentPowerBank/:stationId', async (req, res) => {
    let {stationId} = req.params
    try {
        let rentResults = await StationOperations.rentPowerBank(stationId)
        res.send(rentResults)
    }catch (e){
        res.send({'finalResult': false, 'error': "Could not rent due to an error try again later"})
    }
}),

AdminStationRouters.post('/returnPowerBank/', async (req, res) => {
    let {stationId, powerBankId } = req.body
    try{
        let station = await Station.findOne({where: {
            id: stationId
            }})
        let metaData = [
            {dataTitle: "stationId", dataValue: station.systemId},
            {dataTitle: "powerBankId", dataValue: powerBankId},
        ]
        let r = await Transaction.findOne({
            where : {
                operation : 0,
            },
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            include : [
                {
                    model: TransactionMetaData,
                    as: "MetaData",
                    where: {
                        [Op.or]: [
                            {[Op.and]: [{ dataTitle: "powerBankId" }, { dataValue: powerBankId }]},
                            {dataTitle : "clientId"}
                        ]
                    },
                }
            ],
        })
        if(r!= null){
            r = r.toJSON()
            if(r['MetaData'].length === 2){
                let clientId = r['MetaData'][0]["dataValue"]
                metaData.push({dataTitle: "clientId", dataValue: clientId},)
                let rentTransactionsResults = await TransactionOperations.create(RentTransactionTypes.station.return, metaData)
                let client = await Client.findByPk(clientId)
                console.log(client)
                client.update({type: 0})
                res.send(rentTransactionsResults)
            }else {
                //metaData.push({dataTitle: "partnerId", dataValue: station.currentPartner},)
                let rentTransactionsResults = await TransactionOperations.create(RentTransactionTypes.station.return, metaData)
                if(rentTransactionsResults.finalResult){
                    AnswerHttpRequest.done(res, "Partner return success")
                }
                else {
                    AnswerHttpRequest.wrong(res, "Could not write return transaction correctly")
                }
            }
        }else{
            AnswerHttpRequest.wrong(res, "Cant find teh client that take teh power Bank")
        }


    }
    catch(error){
        console.log(error)
        res.send({'finalResult': false, 'error': error})
    }
}),

AdminStationRouters.get('/queryAPNNs/:stationId/:index', async (req, res) => {
    let {stationId, index} = req.params
    try{
        let results = await StationOperations.queryAPNNs(stationId, index)
        res.send(results)
    }catch (e){
        res.send({finalResult: false, error: e})
    }
}),

AdminStationRouters.post('/setAddress/:stationId', async (req, res) => {
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

AdminStationRouters.get('/setVolume/:stationId/:level', async (req, res) => {
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

AdminStationRouters.use('/', _EndPoints(Station))

module.exports = AdminStationRouters;














