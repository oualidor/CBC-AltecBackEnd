const express = require('express');
const TransactionOperations = require("../../Actors/TransactionOperations");
const Transaction = require("../../Schemas/Transaction");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");



const StationGlobalRouters = require("../../Actors/StationOperations");
const _EndPoints = require("./_EndPoints");
const AdminTransactionRouter = express.Router();

AdminTransactionRouter.get('/getAll/:operation/:offset/:limit', async (req, res) => {
    try {
        let {operation, offset, limit} = req.params
        let getAllOp = await TransactionOperations.getAll(operation, offset, limit)
        if (getAllOp.finalResult) {
            AnswerHttpRequest.done(res, getAllOp.result)
        }else {
            AnswerHttpRequest.wrong(res, getAllOp.error)
        }
    } catch (error) {
        AnswerHttpRequest.wrong(res, "Request Failed")
    }
})

AdminTransactionRouter.get('/getOne/:id', async (req, res) => {
    await StationGlobalRouters.getOne(req, res)
})

AdminTransactionRouter.use('/', _EndPoints(Transaction))

module.exports = AdminTransactionRouter  ;














