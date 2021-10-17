const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const TransactionOperations = require("../../Actors/TransactionOperations");

const router = express.Router();

const StationOperations = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const StatisticsOperations = require("../../Actors/StatisticsOperations");
const Station = require("../../Schemas/Station");
const Model  =require("../../Actors/_Model")
const _Model  = new Model(Station)


class _EndPoints{
    constructor(Model, ModelOperations) {
        this.Model = Model
        this.ModelOperations = ModelOperations
    }


    getAll =  router.get('/getAll/:offset/:limit', async (req, res) => {
        await this.ModelOperations.getAll(req, res)
    })

    count =  router.get('/Count', async (req, res)=>{
        let countOp = await StatisticsOperations.count(this.Model, {})
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })
}

module.exports = _EndPoints



module.exports = _EndPoints;














