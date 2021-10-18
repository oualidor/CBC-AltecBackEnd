const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const ClientOperations = require("../../Actors/ClientOperations");
const Model  =require("../../Actors/_Model")
const EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
let SchemaModel = new Model(Client)
let _EndPoints = new EndPoints(Client, ClientOperations, SchemaModel)
const  AdminClientRouters = {
    ready: router.use('', _EndPoints.count),

    create : router.post('/create', async (req, res) => {
        let gor = await ClientOperations.create(req.body)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }),

    update : router.post('/update/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        let gor = await ClientOperations.update(id, req.body)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    }),

    getAll : router.get('/getAll/:offset/:limit',  async (req, res) => {
        await ClientOperations.getAll(req, res)
    }),

    getOne : router.get('/getOne/:id',  async (req, res) => {
        const id = parseInt(req.params.id);
        let gor = await ClientOperations.findByPk(id)
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

}

module.exports = AdminClientRouters;














