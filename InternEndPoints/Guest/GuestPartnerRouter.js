const express = require('express');
const PartnerOperations = require("../../Actors/PartnerOperations");
const GlobalOperations = require("../../Actors/GlobalOperations")
const Partner = require("../../Schemas/Partner");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const {latLangDistance} = require("../../Apis/Functions");
const  GuestPartnerRouter = express.Router()
GuestPartnerRouter.get('/getOne/:id',  async (req, res) => {
    await PartnerOperations.getOne(req, res)
}),

GuestPartnerRouter.get('/getAllInRange/:lat/:long/:distance', async (req, res)=>{
    try{
        const globalOperations = new GlobalOperations(Partner)
        let {lat, long, distance} = req.params
        let step = 20;
        let total = 99999999999999999999999, length = 9999999999999999999999, current = 0, offset = 0
        let result = []
        while (total >= current && length > 0){
            let getPartnersOp = await globalOperations.getAll(offset, step)
            if(getPartnersOp.finalResult){
                total = getPartnersOp.result.count
                let partners = getPartnersOp.result.rows
                length = partners.length
                partners.forEach(partner =>{
                    let d = latLangDistance(partner.x, lat, partner.y, long)
                    if(d <= distance){
                        result.push(partner)
                    }
                })
                offset = offset+step
            }else {
                break
                AnswerHttpRequest.wrong(res, "Request failed")
            }
        }
        AnswerHttpRequest.done(res, result)
    }catch (error){
        AnswerHttpRequest.wrong(res, "Request failed")
    }


})


module.exports = GuestPartnerRouter;














