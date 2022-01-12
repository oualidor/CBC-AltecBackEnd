const express = require('express');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const Transaction = require("../../Schemas/Transaction");
const Station = require("../../Schemas/Station");
const TransactionMetaData = require("../../Schemas/TransactionMetaData");

const {Op, fn, col} = require("sequelize");
const  PartnerStatsRouter = express.Router()



PartnerStatsRouter.get('/transaction/:operation/:from/:to', async (req, res) => {
    let {operation, from, to}  =req.params


    try{
        let options = {
            attributes: [
                [fn('COUNT', col('id')), 'total']
            ],
        }
        let transactions  = await Transaction.findAndCountAll({
            where: {
                'operation': operation,
                createdAt: {
                    [Op.between]: [new Date(from), new Date(to)],
                }},
            include: [{
                model: TransactionMetaData,
                as: 'MetaData',
            }]
        });
        AnswerHttpRequest.done(res, transactions.rows.length)
    }
    catch (error){
        console.log(error)
        AnswerHttpRequest.wrong(res, "Request failed")
    }




}),




PartnerStatsRouter.get('/transaction/:stationPublicId/:operation/:from/:to', async (req, res) => {
    let {stationPublicId, operation, from, to}  =req.params
    try{

        let station = await Station.findOne({where : {id: stationPublicId}})
        if(station === null){
            AnswerHttpRequest.wrong(res, "No station with the provided public Id")
        }
        else {
            if(station.currentPartner !== req.body.partner.id){
                AnswerHttpRequest.wrong(res, "You are not allowed to see stats for this station")
            }
            else {
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
                    let transactions  = await Transaction.findAndCountAll({
                        where: {'operation': operation},
                        include: [{
                            model: TransactionMetaData,
                            as: 'MetaData',
                            where: {[Op.and]: [{"dataTitle": "stationId"}, {"dataValue": station.systemId.toString()}],}

                        }]
                    });
                    AnswerHttpRequest.done(res, transactions.rows.length)
                }
                catch (error){
                    console.log(error)
                    AnswerHttpRequest.wrong(res, "Request failed")
                }
            }

        }
    }
    catch (error){
        AnswerHttpRequest.wrong(res, "Request failed")
    }

}),







module.exports = PartnerStatsRouter;














