const express = require('express');

const router = express.Router();

const {StationGlobalRouters} = require("../../Actors/StationGlobalOperatios");
const  AdminStationRouters = {
    create: router.post('/create',
        async (req, res) => {
            await StationGlobalRouters.create(req, res)
        }),
    getAll: router.get('/getAll/:offset/:limit',
        async (req, res) => {
            await StationGlobalRouters.getAll(req, res)

        }),
    getOne: router.get('/getOne/:id',
        async (req, res) => {
            await StationGlobalRouters.getOne(req, res)
        }),

    getOneByPublicId: router.get('/getOneByPublicId/:id',
        async (req, res) => {
            await StationGlobalRouters.getOneByPublicId(req, res)
        }),
    getRealTimeInfo: router.get('/getRealTimeInfo/:id',
        async (req, res) => {
            await StationGlobalRouters.getRealTimeInfo(req, res)

        }),
    rentPowerBank: router.get('/rentPowerBank/:id',
        async (req, res) => {
            await StationGlobalRouters.rentPowerBank(req, res)
        }),
}




module.exports = AdminStationRouters;














