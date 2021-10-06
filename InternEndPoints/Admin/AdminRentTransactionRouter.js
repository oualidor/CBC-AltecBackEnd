const express = require('express');
const RentTransactionTypes = require("../../Structures/RentTransactionTypes");
const RentTransactionGlobalRouters = require("../../Actors/RentTransactionOperations");
const RentTransactionOperations = require("../../Actors/RentTransactionOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");

const router = express.Router();

const {StationGlobalRouters} = require("../../Actors/StationGlobalOperatios");
const  AdminRentTransactionRouter = {
    create: router.post('/create', async (req, res) => {
            await StationGlobalRouters.create(req, res)
        }),
    getAll: router.get('/getAll/:offset/:limit', async (req, res) => {
        try {
            let {offset, limit} = req.params
            let getAllOp = await RentTransactionOperations.getAll(offset, limit)
            if (getAllOp.finalResult) AnswerHttpRequest.done(res, getAllOp.result)
            AnswerHttpRequest.wrong(res, getAllOp.error)

        } catch (error) {
            AnswerHttpRequest.wrong(res, "Request Failed")
        }
    }),
    getOne: router.get('/getOne/:id', async (req, res) => {
            await StationGlobalRouters.getOne(req, res)
        }),

}




module.exports = AdminRentTransactionRouter;














