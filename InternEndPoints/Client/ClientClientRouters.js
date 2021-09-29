const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const Validator = require('../../Apis/dataValidator');

const bcrypt = require('bcrypt');
const {ClientGlobalRouters} = require("../../Actors/ClientGlobalOperations");
const {UpdateData} = require("../../Apis/UpdateData");


const  ClientClientRouters = {

    update : router.post('/update/',
            async (req, res) => {
            await  ClientGlobalRouters.update(req, res)
        }),

    getOne : router.get('/getOne/',  async (req, res) => {
        const id = parseInt(req.body.id);
        await ClientGlobalRouters.getOne(req, res, id)
    }),
}





module.exports = ClientClientRouters;














