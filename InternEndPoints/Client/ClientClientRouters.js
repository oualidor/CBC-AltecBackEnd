const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const Validator = require('../../Apis/DataValidator');

const bcrypt = require('bcrypt');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const ClientGlobalOperations = require("../../Actors/ClientOperations");
const {ClientGlobalRouters} = require("../../Actors/ClientOperations");

const  ClientClientRouters = {

    update : router.post('/update/',
            async (req, res) => {
            await  ClientGlobalRouters.update(req, res)
        }),

    getOne : router.get('/getOne/',  async (req, res) => {
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
    }),
}


module.exports = ClientClientRouters;














