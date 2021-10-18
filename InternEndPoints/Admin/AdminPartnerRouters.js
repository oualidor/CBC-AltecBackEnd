const express = require('express');
const seq = require('sequelize');
const PartnerOperations = require("../../Actors/PartnerOperations");
const _EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
const Partner = require("../../Schemas/Partner");
const _EndPointsRouter = _EndPoints(Partner, PartnerOperations)
const  AdminPartnerRouters = express.Router()

AdminPartnerRouters.use('/', _EndPointsRouter),
AdminPartnerRouters.post('/create', async (req, res) => {
            await PartnerOperations.create(req, res)
        }),
AdminPartnerRouters.post('/update/:id', async (req, res) => {
        await  PartnerOperations.update(req, res)
    }),
AdminPartnerRouters.get('/getOne/:id',  async (req, res) => {
        await PartnerOperations.getOne(req, res)
    }),


module.exports = AdminPartnerRouters;














