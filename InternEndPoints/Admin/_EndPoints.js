const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const TransactionOperations = require("../../Actors/TransactionOperations");

const router = express.Router();

const StationOperations = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const StatisticsOperations = require("../../Actors/StatisticsOperations");

class _EndPoints{
    constructor(Schema, SchemaOperations, SchemaModel) {
        this.Schema = Schema
        this.SchemaOperations = SchemaOperations
        this.SchemaModel = SchemaModel
    }

    create =  router.post('/create', async (req, res) => {
        let data  = req.body
        let createOp = await this.SchemaModel.create(data)
        if(createOp.finalResult){
            AnswerHttpRequest.done(res, createOp.result)
        }else {
            AnswerHttpRequest.wrong(res, createOp.error)
        }
    })

    update =  router.post('/update/:id', async (req, res) => {
        let {id} = req.params
        let updateOp = await this.SchemaModel.update(id, req.body)
        if(updateOp.finalResult){
            AnswerHttpRequest.done(res, updateOp.result)
        }else {
            AnswerHttpRequest.wrong(res, updateOp.error)
        }
    })

    getAll =  router.get('/getAll/:offset/:limit', async (req, res) => {
        let {offset, limit} = req.params
        let getAllOp = await this.SchemaModel.getAll(offset, limit)
        if(getAllOp.finalResult){
            AnswerHttpRequest.done(res, getAllOp.result)
        }else {
            AnswerHttpRequest.wrong(res, getAllOp.error)
        }
    })

    searchBy = router.get('/searchBy/:attribute/:value', async (req, res) => {
        let {attribute, value} = req.params
        let stationGeOneOp = await this.SchemaModel.searchBy(attribute, value)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
    })

    count =  router.get('/Count', async (req, res)=>{
        let countOp = await StatisticsOperations.count(this.Schema, {})
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })
}

module.exports = _EndPoints



module.exports = _EndPoints;














