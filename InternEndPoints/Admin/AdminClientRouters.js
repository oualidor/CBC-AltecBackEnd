const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const Validator = require('../../Apis/dataValidator');

const bcrypt = require('bcrypt');
const {ClientGlobalRouters} = require("../../Actors/ClientGlobalOperations");
const {UpdateData} = require("../../Apis/UpdateData");


const  AdminClientRouters = {

        create : router.post('/create',
            async (req, res) => {
            await ClientGlobalRouters.create(req, res)
        }),

        update : router.post('/update/:id',
            async (req, res) => {
            await  ClientGlobalRouters.update(req, res)
        }),

        getAll : router.get('/getAll/:offset/:limit',  async (req, res) => {
            await ClientGlobalRouters.getAll(req, res)
        }),

        getOne : router.get('/getOne/:id',  async (req, res) => {
            const id = parseInt(req.params.id);
            await ClientGlobalRouters.getOne(req, res)
        }),

        getOneByAttribute : router.get('/getOne/:id/:attribute',  async (req, res) => {
            await ClientGlobalRouters.getOneByAttribute(req, res)
        }),

        validate : router.get('/validate/:id',  async (req, res) => {
            await ClientGlobalRouters.validate(req, res)
        }),

        searchBy : router.get('/SearchBy/:attribute/:key',  async (req, res) => {
            const {attribute, key} = req.params;
            let data = {where : { [attribute] : { [seq.Op.like] : '%' + key + '%' } }};
            try{
                let customer = await Client.findAll(data);
                res.send({'finalResult': true, 'result': customer})
            }catch (e) {
                res.send({'finalResult': false, 'error': e})
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
        })
    }





module.exports = AdminClientRouters;














