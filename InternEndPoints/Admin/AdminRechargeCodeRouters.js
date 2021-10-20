const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const bcrypt = require("bcrypt");
const codeGenerator = require("../../Apis/CodeGenerator");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const RechargeCode = require("../../Schemas/RechargeCode");
const {RechargeCodeOperations} = require("../../Actors/RechargeCodeOperations");


const AdminRechargeCodeRouters = express.Router();

AdminRechargeCodeRouters.post('/create', async (req, res) => {
    try{
        let {partnerId, stat, amount, number} = req.body
        let data = []
        for(let i in [...Array(number).keys()]){
            const hashedCode = await codeGenerator.toString()
            data.push({partnerId,  hashedCode, amount, stat})
        }
        let createOp = await RechargeCodeOperations.bulkCreate(data)

        if(createOp.finalResult){
            AnswerHttpRequest.done(res, "done")
        }else {
            let error  = createOp.error
            if(error.name.match(/Sequelize/)){
                error = error.errors[0].message
                AnswerHttpRequest.wrong(res, error)
            }else {

            }

        }
    }catch (error){
        if(error.name.match(/Sequelize/)){
            error = error.errors[0].message
            AnswerHttpRequest.wrong(res, error)
        }else  AnswerHttpRequest.wrong(res, error)

    }
})

AdminRechargeCodeRouters.get('/update/:id/:stat', async (req, res) => {
    try{
        let {id, stat} = req.params
        let data = {stat}
        let gor = await RechargeCodeOperations.update(id, data)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }catch (error){
        AnswerHttpRequest.wrong(res, "Request failed")
    }
})

AdminRechargeCodeRouters.get('/getAll/:offset/:limit', async (req, res) => {
    try{
        let {offset, limit} = req.params
        let gor = await RechargeCodeOperations.getAll(offset, limit)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }catch (error){
        AnswerHttpRequest.wrong(res, "Request failed")
    }
})

AdminRechargeCodeRouters.use('/', _EndPoints(RechargeCode))

module.exports = AdminRechargeCodeRouters;














