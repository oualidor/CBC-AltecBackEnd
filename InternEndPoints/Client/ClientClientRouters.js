const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const Validator = require('../../Apis/DataValidator');

const bcrypt = require('bcrypt');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const ClientGlobalOperations = require("../../Actors/ClientOperations");
const ClientGlobalRouters = require("../../Actors/ClientOperations");

const  ClientClientRouters = express.Router()


ClientClientRouters.post('/update/', async (req, res) => {
    let {fullName, password} = req.body
    let updateOp =  await  ClientGlobalRouters.update(req.body.id, {fullName, password})
    if(updateOp.finalResult){
        AnswerHttpRequest.done(res, updateOp.result)
    }else {
        AnswerHttpRequest.wrong(res, updateOp.error)
    }
}),

ClientClientRouters.get('/getOne/',  async (req, res) => {
    const id = parseInt(req.body.id);
    let gor = await ClientGlobalOperations.findByPk(id)
    if(gor.finalResult){
        let client = gor.result
        if(client != false){
            AnswerHttpRequest.done(res, client)
        }else {
            AnswerHttpRequest.wrong(res, "client not found")
        }
    }else {
        AnswerHttpRequest.wrong(res, gor.error)
    }
})



module.exports = ClientClientRouters;














