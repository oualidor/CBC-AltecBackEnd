const express = require('express');
const RentTransactionTypes = require("../../Structures/RentTransactionTypes");
const bcrypt = require("bcrypt");
const codeGenerator = require("../../Apis/CodeGenerator");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const {RechargeCodeOperations} = require("../../Actors/RechargeCodeOperations");
const {RentTransactionGlobalRouters} = require("../../Actors/RentTransactionGlobalOperatios");

const router = express.Router();

const {StationGlobalRouters} = require("../../Actors/StationGlobalOperatios");
const  AdminRechargeCodeRouters = {
    create: router.post('/create', async (req, res) => {
        try{
            let {partnerId, stat, amount, number} = req.body
            let data = []
            for(let i in [...Array(number).keys()]){
                const hashedCode = await codeGenerator.toString()
                data.push({partnerId,  hashedCode, amount, stat})
            }
            let code = await RechargeCodeOperations.bulkCreate(data)
            if(code){
                AnswerHttpRequest.done(res, code.id)
            }else {
                AnswerHttpRequest.wrong(res, "Request failed")
            }
        }catch (error){
            console.log(error)
            AnswerHttpRequest.wrong(res, "Request failed")
        }
    }),

    update: router.get('/update/:id/:stat', async (req, res) => {
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
    }),

    getAll: router.get('/getAll/:offset/:limit', async (req, res) => {
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
    }),

    getOne: router.get('/getOne/:id', async (req, res) => {
            await StationGlobalRouters.getOne(req, res)
        }),

    getOneByPublicId: router.get('/getOneByPublicId/:id', async (req, res) => {
            await StationGlobalRouters.getOneByPublicId(req, res)
        }),
}




module.exports = AdminRechargeCodeRouters;













