const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const RentTransactionGlobalRouters = require("../../Actors/TransactionOperations");
const RentTransactionOperations = require("../../Actors/TransactionOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");

const router = express.Router();

const StationGlobalRouters = require("../../Actors/StationOperations");
const  AdminTransactionRouter = {
    create: router.post('/create', async (req, res) => {
            await StationGlobalRouters.create(req, res)
        }),

    getAll: router.get('/getAll/:operation/:offset/:limit', async (req, res) => {
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
    }),

    getOne: router.get('/getOne/:id', async (req, res) => {
            await StationGlobalRouters.getOne(req, res)
        }),

}




module.exports = AdminTransactionRouter;













