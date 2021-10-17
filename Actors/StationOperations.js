const {UpdateData} = require("../Apis/UpdateData");
const seq = require('sequelize')
const axios = require("axios");
const CurrentActor = require("../Schemas/Station");
const GlOpResult = require("../Structures/GlOpResult");
const Partner = require("../Schemas/Partner");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const {TCP_SERVER} = require("../Apis/Config");

CurrentActor.belongsTo(Partner, {foreignKey: "currentPartner"})

const StationOperations = {

    create : async (req, res) => {
        try {
            let validatedData = true;
            let dataError = "";
            if (!validatedData) {
                res.send({'finalResult': false, 'error': dataError});
            }
            else{
                try {
                    let newStation = await CurrentActor.create(req.body);
                    AnswerHttpRequest.done(res, newStation)
                }catch (error){
                    let errorMsg = error.errors[0].message
                    AnswerHttpRequest.wrong(res, errorMsg)
                }
            }
        }
        catch (error) {
            console.log(error)
            res.send({'finalResult': false, 'error': "Request failed"})
        }
    },

    update : async (id, data) => {
        try {
            const preparedData = UpdateData(data)
            let currentActor = await CurrentActor.findByPk(id);
            if(currentActor != null){
                await currentActor.update(preparedData);
                return  GlOpResult(true, "Station updated")
            }else{
                return  GlOpResult(false, "Station code not found")
            }
        }catch (error){
            console.log(error)
            return  GlOpResult(false, "could not update Station info")
        }
    },

    getAll : async (req, res) => {
        var {offset, limit} = req.params;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        CurrentActor.findAll({offset: offset, limit: limit})
            .then(stations =>
                res.send({'finalResult': true, 'result': stations})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': err})
            );
    },

    getOne: async (id) => {
        try {
            let station = await CurrentActor.findByPk(
                id,
                {
                    include : [Partner],
                }

            )
            if (station != null) {
                return GlOpResult(true, station)
            } else {
                return GlOpResult(false, "no station found with id: " +id)
            }
        } catch (err) {
            console.log(err)
            return GlOpResult(false, "Operation failed")
        }
    },

    getOneByPublicId: async (id) => {
        try {
            let station = await CurrentActor.findOne({
                where: {
                    id: id
                },
                include : [Partner],

            });
            if (station != null) {
                return GlOpResult(true, station)
            } else {
                return GlOpResult(false, "no station found with id: " + id)
            }
        } catch (err) {
            return GlOpResult(false, "Operation failed")
        }
    },

    getRealTimeInfo:  async (req, res) => {
        let {id} = req.params
        let requestAddress = TCP_SERVER+'Station/QueryInfo/'+id
        try {
            const request  = await axios({url: requestAddress, method: "get", responseType: 'json'})
            res.send(request.data)
        }catch (e){
            res.send({finalResult: false, error: e})
        }
    },

    rentPowerBank: async (id) => {
        let requestAddress = TCP_SERVER + 'Station/rent/'+id
        try {
            const request = await axios({url: requestAddress, method: "get", responseType: 'json'})
            return request.data
        } catch (e) {

            console.log(e)
            return {finalResult: false, error: e}
        }
    },

    queryAPNNs: async (stationId, index) => {
        let requestAddress = TCP_SERVER + 'Station/QueryAPN/'+stationId+"/"+index
        try {
            const request = await axios({url: requestAddress, method: "get", responseType: 'json'})
            return request.data
        } catch (e) {

            console.log(e)
            return {finalResult: false, error: e}
        }
    },

    searchBy: async (attribute, value) => {
        let data = {where: {[attribute]: {[seq.Op.like]: '%' + value + '%'}}};
        try {
            let result = await CurrentActor.findAll(data);
            return GlOpResult(true, result)
        } catch (e) {
            console.log(e)
            return GlOpResult(false, e)
        }
    },

    sendRequest: {
        GET: async (point) => {
            let URL = TCP_SERVER + point
            try {
                const request = await axios({url: URL, method: "get", responseType: 'json'})
                return request.data
            } catch (e) {
                console.log(e)
                return {finalResult: false, error: e}
            }
        },

        POST: async (point, postData)=>{
            let URL = TCP_SERVER + point
            try{
                const response  = await axios(
                    {
                        url: URL,
                        method: "post",
                        responseType: 'json',
                        headers: {'Content-Type': 'application/json', authorization: 'Bearer ' + "adminToken"},
                        data: postData,
                    })
                const result = await response.data;
                return result
            }catch (error){
                console.log(error)
                return {finalResult: false, error: error}
            }
        }
    },
}

module.exports = StationOperations