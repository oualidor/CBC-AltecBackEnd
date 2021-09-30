const express = require('express');

const router = express.Router();

const {RentTransactionGlobalRouters} = require("../../Actors/RentTransactionGlobalOperatios");
const  ClientRentTransactionRouters = {
    create: router.post('/create',
        async (req, res) => {
            await RentTransactionGlobalRouters.create(req, res)
    }),
    getAll: router.get('/getAll/:offset/:limit',
        async (req, res) => {
            await RentTransactionGlobalRouters.getAll(req, res)
    }),
    getOne: router.get('/getOne/:id',
        async (req, res) => {
            await RentTransactionGlobalRouters.getOne(req, res)
    }),
}




module.exports = ClientRentTransactionRouters;














