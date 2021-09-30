const express = require('express');
const RentTransaction = require("../../Schemas/RentTransaction");
const {RentTransactionGlobalRouters} = require("../../Actors/RentTransactionGlobalOperatios");

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
        let StationId = req.params.id;
        try{
            let rentResult = await StationGlobalRouters.rentPowerBank(StationId)
            if(rentResult.finalResult === true){
                let rentTransactionsResults = await RentTransactionGlobalRouters.create({
                    StationId, clientId, powerBankId: rentResult.data.powerBankId,  type: "01"
                })
                if(rentTransactionsResults === true){
                    res.send( res.send({'finalResult': true, result: "Power bank rented successfully"}))

                }else {
                    res.send( res.send({'finalResult': false, error: "power bank rented but failed to crate transaction"}))
                }
            }else {
                res.send(rentResult)
            }
        }catch (e){
            res.send({'finalResult': false, 'error': "Could not rent due to an error try again later"})
        }
    }),
}




module.exports = ClientStationRouters;














