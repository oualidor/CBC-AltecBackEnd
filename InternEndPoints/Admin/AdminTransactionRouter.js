const express = require('express');
const RentTransactionTypes = require("../../Structures/RentTransactionTypes");
const RentTransactionGlobalRouters = require("../../Actors/TransactionOperations");
const RentTransactionOperations = require("../../Actors/TransactionOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");

const router = express.Router();

const {StationGlobalRouters} = require("../../Actors/StationGlobalOperatios");
const  AdminTransactionRouter = {
    create: router.post('/create', async (req, res) => {
            await StationGlobalRouters.create(req, res)
        }),
    getAll: router.get('/getAll/:offset/:limit', async (req, res) => {
        try {
            let {offset, limit} = req.params
            let getAllOp = await RentTransactionOperations.getAll(offset, limit)
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














