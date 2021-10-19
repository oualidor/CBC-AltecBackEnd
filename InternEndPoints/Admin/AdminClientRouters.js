const express = require('express');
const Client = require('../../Schemas/Client');
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const ClientOperations = require("../../Actors/ClientOperations");
const _EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
const  AdminClientRouters = express.Router()



AdminClientRouters.post('/create', async (req, res) => {
        let gor = await ClientOperations.create(req.body)
        if(gor.finalResult){
            AnswerHttpRequest.done(res, gor.result)
        }else {
            AnswerHttpRequest.wrong(res, gor.error)
        }
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

AdminClientRouters.use('/', _EndPoints(Client))

module.exports = AdminClientRouters;














