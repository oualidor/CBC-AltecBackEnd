const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const Validator = require('../../Apis/DataValidator');

const bcrypt = require('bcrypt');
const PartnerOperations = require("../../Actors/PartnerOperations");
const {UpdateData} = require("../../Apis/UpdateData");


const  AdminPartnerRouters = {

        create : router.post('/create',
            async (req, res) => {
            await PartnerOperations.create(req, res)
        }),

        update : router.post('/update/:id',
            async (req, res) => {
            await  PartnerOperations.update(req, res)
        }),

        getAll : router.get('/getAll/:offset/:limit',  async (req, res) => {
            await PartnerOperations.getAll(req, res)
        }),

        getOne : router.get('/getOne/:id',  async (req, res) => {
            await PartnerOperations.getOne(req, res)
        }),

    }





module.exports = AdminPartnerRouters;














