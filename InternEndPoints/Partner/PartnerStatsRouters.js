const express = require('express');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const Transaction = require("../../Schemas/Transaction");

const {Op, fn, col} = require("sequelize");
const  PartnerStatsRouter = express.Router()




PartnerStatsRouter.get('/transaction/:operation/:from/:to', async (req, res) => {
    let {operation, from, to}  =req.params
    try{
        let options = {
            attributes: [
                [fn('COUNT', col('id')), 'total']
            ],
            where : {
                operation: operation,
                createdAt: {
                    [Op.between]: [new Date(from), new Date(to)],
                }}
        }
        let total  = await Transaction.count(options);
        AnswerHttpRequest.done(res, total)
    }catch (error){
        console.log(error)
        AnswerHttpRequest.wrong(res, "Request failed")
    }
}),







module.exports = PartnerStatsRouter;














