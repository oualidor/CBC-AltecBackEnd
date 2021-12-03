const express = require('express');
const codeGenerator = require("../../Apis/CodeGenerator");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const RechargeCode = require("../../Schemas/RechargeCode");
const {RechargeCodeOperations} = require("../../Actors/RechargeCodeOperations");
const RechargeCodeStates = require("../../Structures/rechargeCodeStates");


const PartnerRechargeCodeRouter = express.Router();

/*PartnerRechargeCodeRouter.get('/update/:id/:stat', async (req, res) => {
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
})*/

PartnerRechargeCodeRouter.get('/getAll/:offset/:limit', async (req, res) => {
    try{
        let partnerId = req.body.partner.id
        let {offset, limit} = req.params
        let gor = await RechargeCodeOperations.getAll({offset, limit, where : {partnerId : partnerId}})
        if(gor.finalResult){
            let rechargeCodes = gor.result
            AnswerHttpRequest.done(res, rechargeCodes)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }catch (error){
        console.log(error)
        AnswerHttpRequest.wrong(res, "Request failed")
    }
})

module.exports = PartnerRechargeCodeRouter;














