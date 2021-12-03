const express = require('express');
const seq = require('sequelize');
const PartnerOperations = require("../../Actors/PartnerOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const  PartnerPartnerRouter = express.Router()


PartnerPartnerRouter.post('/update/', async (req, res) => {
        await  PartnerOperations.update(req, res)
}),
PartnerPartnerRouter.get('/getOne/',  async (req, res) => {
        AnswerHttpRequest.done(res, req.body.partner)
}),

module.exports = PartnerPartnerRouter;














