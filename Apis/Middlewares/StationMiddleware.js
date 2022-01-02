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
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    },

    validateExistence :  async (req, res, next) => {
        try {
            let stationId = req.body.stationId;
            let stationFindOperation = await StationOperations.getOneByPublicId(stationId)
            if(stationFindOperation.finalResult){
                let station = stationFindOperation.result
                req.station = station
                next()
            } else {
                AnswerHttpRequest.wrong(res, stationFindOperation.error)
            }
        } catch (error) {
            AnswerHttpRequest.wrong(res, "Opefdsfsdfdsfsdfsdfon failed")
        }
    }
}


module.exports = StationMiddleware
