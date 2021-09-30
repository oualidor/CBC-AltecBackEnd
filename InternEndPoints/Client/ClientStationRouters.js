const express = require('express');
const RentTransaction = require("../../Schemas/RentTransaction");

const router = express.Router();

const {StationGlobalRouters} = require("../../Actors/StationGlobalOperatios");
const  ClientStationRouters = {

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
    rentPowerBank: router.get('/rentPowerBank/:id', async (req, res) => {
        let clientId = req.body.id;
        console.log(clientId)
        let StationId = req.params.id;
        try{
            let rentResult = await StationGlobalRouters.rentPowerBank(req, res)
            if(rentResult.finalResult != false){
                await RentTransaction.create({StationId, clientId, powerBankId: rentResult.data.powerBankId,  type: "01"});
            }else {
                res.send({'finalResult': false, 'error': "Could not rent teh power bank"})
            }
        }catch (e){
            res.send({'finalResult': false, 'error': e})
        }
    }),
}




module.exports = ClientStationRouters;














