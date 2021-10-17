const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const TransactionOperations = require("../../Actors/TransactionOperations");

const router = express.Router();

const StationOperations = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const StatisticsOperations = require("../../Actors/StatisticsOperations");
const Station = require("../../Schemas/Station");



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

    getAll =  router.get('/getAll/:offset/:limit', async (req, res) => {
        let {offset, limit} = req.params
        await this.SchemaModel.getAll(offset, limit)
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














