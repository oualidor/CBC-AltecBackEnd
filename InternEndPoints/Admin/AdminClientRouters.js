const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const ClientOperations = require("../../Actors/ClientOperations");
const EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
let _EndPoints = new EndPoints(Client, ClientOperations)
const  AdminClientRouters = express.Router()

AdminClientRouters.use('/', _EndPoints.count)

AdminClientRouters.post('/create', async (req, res) => {
        let gor = await ClientOperations.create(req.body)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    })

AdminClientRouters.post('/update/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        let gor = await ClientOperations.update(id, req.body)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    })

AdminClientRouters.get('/getAll/:offset/:limit',  async (req, res) => {
        await ClientOperations.getAll(req, res)
    })

AdminClientRouters.get('/getOne/:id',  async (req, res) => {
        const id = parseInt(req.params.id);
        let gor = await ClientOperations.findByPk(id)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
    })

AdminClientRouters.get('/delete/:id',  async (req, res) => {
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
    })

module.exports = AdminClientRouters;














