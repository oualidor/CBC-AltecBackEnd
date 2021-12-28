const express = require('express');
const seq = require('sequelize');
const PartnerOperations = require("../../Actors/PartnerOperations");
const _EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
const Partner = require("../../Schemas/Partner");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const  AdminPartnerRouters = express.Router()


AdminPartnerRouters.post('/create', async (req, res) => {
            await PartnerOperations.create(req, res)
        }),
AdminPartnerRouters.post('/update/:id', async (req, res) => {
        await  PartnerOperations.update(req, res)
    }),
AdminPartnerRouters.get('/getOne/:id',  async (req, res) => {
        await PartnerOperations.getOne(req, res)
    }),
AdminPartnerRouters.post('/addImages/:id',  async (req, res) => {

    let partnerId = req.params.id
    let imagesData = req.body['images']
    let addOp = await PartnerOperations.addImages(partnerId, imagesData)
    if(addOp.finalResult){
        AnswerHttpRequest.done(res, "done")
    }else {
        AnswerHttpRequest.wrong(res, addOp.error)
    }
}),
AdminPartnerRouters.get('/deleteImages/:id',  async (req, res) => {

    let imageId = req.params.id
    let removeOp = await PartnerOperations.removeImage(imageId)
    if(removeOp.finalResult){
        AnswerHttpRequest.done(res, "done")
    }else {
        AnswerHttpRequest.wrong(res, removeOp.error)
    }
}),
AdminPartnerRouters.use('/', _EndPoints(Partner)),

module.exports = AdminPartnerRouters;














