const express = require('express');
const RentTransactionTypes = require("../../Structures/RentTransactionTypes");
const {RentTransactionGlobalRouters} = require("../../Actors/RentTransactionGlobalOperatios");

const router = express.Router();

const {StationGlobalRouters} = require("../../Actors/StationGlobalOperatios");
const  AdminStationRouters = {
    create: router.post('/create', async (req, res) => {
            await StationGlobalRouters.create(req, res)
        }),
    getAll: router.get('/getAll/:offset/:limit', async (req, res) => {
            await StationGlobalRouters.getAll(req, res)

        }),
    getOne: router.get('/getOne/:id', async (req, res) => {
            await StationGlobalRouters.getOne(req, res)
        }),

    getOneByPublicId: router.get('/getOneByPublicId/:id', async (req, res) => {
            await StationGlobalRouters.getOneByPublicId(req, res)
        }),
    getRealTimeInfo: router.get('/getRealTimeInfo/:id', async (req, res) => {await StationGlobalRouters.getRealTimeInfo(req, res)

        }),
    rentPowerBank: router.get('/rentPowerBank/:stationId', async (req, res) => {
        let {stationId} = req.params

        try {
            let rentResults = await StationGlobalRouters.rentPowerBank(stationId)
            res.send(rentResults)
        }catch (e){
            res.send({'finalResult': false, 'error': "Could not rent due to an error try again later"})
        }
    }),

    returnPowerBank: router.get('/returnPowerBank/:stationId', async (req, res) => {
        let clientId = "1";
        let StationId = "1";
        let powerBankId = "11"
        try{
            let rentTransactionsResults = await RentTransactionGlobalRouters.create({
                StationId, clientId, powerBankId, type: RentTransactionTypes.return
            })
            if(rentTransactionsResults === true){
                res.send( res.send({'finalResult': true, result: "Power bank returned successfully"}))
            }else {
                res.send( res.send({'finalResult': false, error: "failed to create transaction"}))
            }
        }catch (e){
            console.log(e)
            res.send({'finalResult': false, 'error': e})
        }
    }),
}




module.exports = AdminStationRouters;














