const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const Validator = require('../../Apis/DataValidator');

const bcrypt = require('bcrypt');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const {ClientGlobalOperations} = require("../../Actors/ClientGlobalOperations");
const {UpdateData} = require("../../Apis/UpdateData");

const Model  =require("../../Actors/_Model")
const _Model  = new Model(Client)
const  AdminClientRouters = {

    create : router.post('/create', async (req, res) => {
        let gor = await ClientGlobalOperations.create(req.body)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }),

    update : router.post('/update/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        let gor = await ClientGlobalOperations.update(id, req.body)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }),

    getAll : router.get('/getAll/:offset/:limit',  async (req, res) => {
        await ClientGlobalOperations.getAll(req, res)
    }),

    getOne : router.get('/getOne/:id',  async (req, res) => {
        const id = parseInt(req.params.id);
        let gor = await ClientGlobalOperations.findByPk(id)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }),

    delete : router.get('/delete/:id',  async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            let customer = await Client.findByPk(id);
            if(customer != null){
                try {
                    await customer.destroy();
                    res.send({'finalResult': true, 'result': "Client deleted"})
                }catch (ee) {
                    res.send({'finalResult': false, 'error': ee})
                }
            }else{
                res.send({'finalResult': false, 'error': "No customer with the provided Id"})
            }
        }catch (e){
            res.send({'finalResult': false, 'error': e})
        }
    }),

    searchBy: router.get('/searchBy/:attribute/:value', async (req, res) => {
            let {attribute, value} = req.params
            let stationGeOneOp = await _Model.searchBy(attribute, value)
            if(stationGeOneOp.finalResult){
                AnswerHttpRequest.done(res, stationGeOneOp.result)
            }
            else{
                AnswerHttpRequest.wrong(res, stationGeOneOp.error)
            }
        }),

    count:  router.get('/Count', async (req, res)=>{
        let countOp = await _Model.count(Client)
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })
}

module.exports = AdminClientRouters;














