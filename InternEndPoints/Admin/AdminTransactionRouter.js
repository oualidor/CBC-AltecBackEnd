const express = require('express');
const RentTransactionOperations = require("../../Actors/TransactionOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");



const StationGlobalRouters = require("../../Actors/StationOperations");
const AdminTransactionRouter = express.Router();

AdminTransactionRouter.get('/getAll/:operation/:offset/:limit', async (req, res) => {
    try {
        let {operation, offset, limit} = req.params
        let getAllOp = await RentTransactionOperations.getAll(operation, offset, limit)
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



module.exports = AdminTransactionRouter;














