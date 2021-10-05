const express = require('express');
const seq = require('sequelize');
const router = express.Router();
const Client = require('../../Schemas/Client');
const Validator = require('../../Apis/dataValidator');

const bcrypt = require('bcrypt');
const {PartnerGlobalOperations} = require("../../Actors/PartnerGlobalOperations");
const {UpdateData} = require("../../Apis/UpdateData");


const  AdminPartnerRouters = {

        create : router.post('/create',
            async (req, res) => {
            await PartnerGlobalOperations.create(req, res)
        }),

        update : router.post('/update/:id',
            async (req, res) => {
            await  PartnerGlobalOperations.update(req, res)
        }),

        getAll : router.get('/getAll/:offset/:limit',  async (req, res) => {
            await PartnerGlobalOperations.getAll(req, res)
        }),

        getOne : router.get('/getOne/:id',  async (req, res) => {
            await PartnerGlobalOperations.getOne(req, res)
        }),

    }





module.exports = AdminPartnerRouters;














