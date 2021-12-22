const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const ClientOperations = require("../../Actors/ClientOperations");
const StationOperations = require("../../Actors/StationOperations");
const StationMiddleware = {

    byPassStat :  (station, req, res, next) => {
        try {
            switch (station.stat){
                case 0:
                    next()
                    break;
                case 1:
                    AnswerHttpRequest.wrong(res, "Station is frozen by administration")
                    break;
                default:
                    AnswerHttpRequest.wrong(res, "Operation failed")

            }
        }
        catch (error){
            console.log("hkjhdfkjhsdfkjsdhfkjsdf")
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    },

    validateExistence :  async (stationPublicId, req, res, next) => {
        try {
            let stationFindOperation = await StationOperations.getOneByPublicId(stationPublicId)
            if(stationFindOperation.finalResult){
                let station = stationFindOperation.result
                req.station = station

                next()
            } else {
                AnswerHttpRequest.wrong(res, stationFindOperation.error)
            }
        } catch (error) {
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    }
}


module.exports = StationMiddleware