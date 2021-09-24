const  axios = require( "axios");

const express = require('express');
const seq = require('sequelize');
const bcrypt = require('bcrypt');
const router = express.Router();
const Station = require('../Schemas/Station');
const Validator = require("../Apis/dataValidator");
const {TCP_SERVER} = require("../Apis/Config");
const  AdminStationRouters = {
        create : router.post('/create',  async (req, res) => {
            let {id, currentPartner, stat} = req.body;
            let validatedData = true;
            let dataError = "";

            if(!validatedData){
                res.send({'finalResult': false,  'error': dataError});
            }else{
                let data = {id, currentPartner, stat};
                try {
                    await Station.create(data);
                    res.send({'finalResult': true, 'result': true})
                }catch (e) {
                    res.send({'finalResult': false, 'error': e})
                }
            }
        }),
        getAll : router.get('/getAll/:offset/:limit',  async (req, res) => {
            var {offset, limit} = req.params;
            limit = parseInt(limit);
            offset = parseInt(offset);
            if (limit === 0) limit = 99999999
            Station.findAll({offset: offset, limit: limit})
                .then(stations =>
                    res.send({'finalResult': true, 'result': stations})
                )
                .catch(err =>
                    res.send({'finalResult': false, 'error': err})
                );
        }),
        getOne: router.get('/getOne/:id', async (req, res) => {
            const {id} = req.params

            try {
                let station = await Station.findByPk(id);
                if (station != null) {
                    res.send({'finalResult': true, 'result': station})
                } else {
                    res.send({'finalResult': false, 'error': {}})
                }
            } catch (err) {
                res.send({'finalResult': false, 'error': err})
            }
        }),
        getRealTimeInfo: router.get('/getRealTimeInfo/:id', async (req, res) => {
            let {boxId} = req.params
            let requestAddress = TCP_SERVER+'Station/QueryInfo/'+boxId
            try {
                const request  = await axios({url: requestAddress, method: "get", responseType: 'json'})
                res.send(request.data)
            }catch (e){
                res.send({finalResult: false, error: e})
            }
        }),
        rentPowerBank: router.get('/rentPowerBank/:id', async (req, res) => {
            let requestAddress = TCP_SERVER+'rent/RL3H082007680121'
            try {
                const request  = await axios({url: requestAddress, method: "get", responseType: 'json'})
                res.send(request.data)
            }catch (e){
                res.send({finalResult: false, error: e})
            }
        })
}




module.exports = AdminStationRouters;














