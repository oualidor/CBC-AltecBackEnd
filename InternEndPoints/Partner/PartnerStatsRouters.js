const express = require('express');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const Transaction = require("../../Schemas/Transaction");
const Station = require("../../Schemas/Station");
const Partner = require("../../Schemas/Partner");
const TransactionMetaData = require("../../Schemas/TransactionMetaData");

const {Op, fn, col} = require("sequelize");
const  PartnerStatsRouter = express.Router()



// PartnerStatsRouter.get('/transaction/:operation/:from/:to', async (req, res) => {
//     let {operation, from, to}  =req.params
//
//
//     try{
//         let options = {
//             attributes: [
//                 [fn('COUNT', col('id')), 'total']
//             ],
//         }
//         let transactions  = await Transaction.findAndCountAll({
//             where: {
//                 'operation': operation,
//                 createdAt: {
//                     [Op.between]: [new Date(from), new Date(to)],
//                 }},
//             include: [{
//                 model: TransactionMetaData,
//                 as: 'MetaData',
//             }]
//         });
//         AnswerHttpRequest.done(res, transactions.rows.length)
//     }
//     catch (error){
//         console.log(error)
//         AnswerHttpRequest.wrong(res, "Request failed")
//     }
//
//
//
//
// }),




PartnerStatsRouter.get('/transaction/:operation/:from/:to', async (req, res) => {
    let {operation, from, to}  =req.params
    try{
        let partner = await Partner.findByPk(req.body.partner.id, {
            include : [
                {
                    model: Station,
                    as: "Stations"
                }
            ]
        })
        if(partner === null){
            AnswerHttpRequest.wrong(res, "No stations affected to this partner, no stats")

        }
        else {
            try{
                let partnerStations = []
                for (let station of partner['Stations']){
                    partnerStations.push(station.systemId.toString())
                }
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
                    raw: true,
                    where: {'operation': operation},
                    include: [{
                        model: TransactionMetaData,
                        as: 'MetaData',
                        where: {
                            [Op.and]: [
                                {"dataTitle": "stationId"},
                                {"dataValue": {[Op.in]: partnerStations}}
                            ]
                        }

                    }]
                });

                let result = [0, 0, 0, 0, 0, 0, 0]
                for (let transaction of transactions.rows){
                    let transactionDate = new Date(transaction['createdAt'])
                    result[transactionDate.getDay()] = result[transactionDate.getDay()]+1
                }

                AnswerHttpRequest.done(res, result)
            }
            catch (error){
                console.log(error)
                AnswerHttpRequest.wrong(res, "Request failed")
            }

        }
    }
    catch (error){
        console.log(error)
        AnswerHttpRequest.wrong(res, "Request failed")
    }

}),







module.exports = PartnerStatsRouter;














