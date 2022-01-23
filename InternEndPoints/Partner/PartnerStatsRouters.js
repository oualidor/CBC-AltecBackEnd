const express = require('express');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const Transaction = require("../../Schemas/Transaction");
const Station = require("../../Schemas/Station");
const Partner = require("../../Schemas/Partner");
const TransactionMetaData = require("../../Schemas/TransactionMetaData");

const {Op, fn, col} = require("sequelize");
const  PartnerStatsRouter = express.Router()


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
                            ],
                            createdAt: {
                                [Op.between]: [new Date(from), new Date(to)],
                            }
                        }

                    }]
                });

                // let result = [0, 0, 0, 0, 0, 0, 0]
                // for (let transaction of transactions.rows){
                //     let transactionDate = new Date(transaction['createdAt'])
                //     result[transactionDate.getDay()] = result[transactionDate.getDay()]+1
                // }

                AnswerHttpRequest.done(res, transactions.count)
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






PartnerStatsRouter.get('/transaction/:operation/:from/:to/:aa', async (req, res) => {
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
            let dateFrom = new Date(from);
            dateFrom.setTime(dateFrom.getTime() + (1*60*60*1000))
            let dateTo = new Date(to);
            dateTo.setTime(dateTo.getTime() + (1*60*60*1000))

            // To calculate the time difference of two dates
            let Difference_In_Time = dateTo.getTime() - dateFrom.getTime();
            // To calculate the no. of days between two dates
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            let result = new Array(Difference_In_Days+1).fill(0);
            result.forEach((entry, index) =>{
                let newDate  = new Date(from)
                newDate.setTime(newDate.getTime() + (1*60*60*1000))
                newDate.setDate(newDate.getDate() + index)
                result[index] = {date: newDate.toISOString().substr(0, 10), count : 0}
            })
            try{
                let partnerStations = []
                for (let station of partner['Stations']){
                    partnerStations.push(station.systemId.toString())
                }
                for (let index = 0; index < result.length; index++){
                    const {date, count} = result[index];
                    let from = new Date(date), to = new Date(date)
                    from.setHours(0, 0, 0)
                    to.setHours(23, 59, 59)
                    let transactions  = await Transaction.findAndCountAll({
                        raw: true,
                        where: {
                            'operation': operation,
                            createdAt: {
                                [Op.between]: [from, to],
                            }
                        },
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
                    result[index]['count'] = transactions.count
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














