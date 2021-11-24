const express = require('express');
const TransactionOperations = require("../../Actors/TransactionOperations");
const Transaction = require("../../Schemas/Transaction");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const StationGlobalRouters = require("../../Actors/StationOperations");
const ClientTransactionRouter = express.Router();

ClientTransactionRouter.get('/getAll/:operation/:offset/:limit', async (req, res) => {
    try {
        let {operation, offset, limit} = req.params
        let getAllOp = await TransactionOperations.getAll(operation, offset, limit)
        if (getAllOp.finalResult) {
            let transactions = getAllOp.result, result = []
            transactions.forEach(transaction => {
                let metaDataList = transaction['MetaData'], relevant = false
                metaDataList.forEach(metaData => {
                    if(metaData.dataTitle === "clientId" && parseInt(metaData.dataValue) === req.body.client.id){
                        relevant = true
                    }
                })
                if(relevant) result.push(transaction)
            })

            AnswerHttpRequest.done(res, result)
        }else {
            AnswerHttpRequest.wrong(res, getAllOp.error)
        }
    } catch (error) {
        AnswerHttpRequest.wrong(res, "Request Failed")
    }
})

ClientTransactionRouter.get('/getOne/:id', async (req, res) => {
    try {
        let getAllOp = await TransactionOperations.getOne(req.params.id)
        if (getAllOp.finalResult) {
            let transaction = getAllOp.result
            let metaDataList = transaction['MetaData'], relevant = false
            metaDataList.forEach(metaData => {
                if(metaData.dataTitle === "clientId" && parseInt(metaData.dataValue) === req.body.client.id){
                    relevant = true
                }
            })
            if(relevant){
                AnswerHttpRequest.done(res, transaction)
            }else {
                AnswerHttpRequest.wrong(res, "Your are not allowed to get this transaction, action reported")
            }
        }else {
            AnswerHttpRequest.wrong(res, getAllOp.error)
        }
    } catch (error) {
        AnswerHttpRequest.wrong(res, "Request Failed")
    }
})



module.exports = ClientTransactionRouter  ;














