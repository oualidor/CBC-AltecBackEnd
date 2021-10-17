
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const TransactionOperations = require("../../Actors/TransactionOperations");

const router = express.Router();

const StationOperations = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const StatisticsOperations = require("../../Actors/StatisticsOperations");
const Station = require("../../Schemas/Station");
const Model  =require("../../Actors/_Model")
const _Model  = new Model(Station)


class _EndPoints{
    constructor(Model) {
        this.Model = Model
    }

    count =  router.get('/Count', async (req, res)=>{
        let countOp = await StatisticsOperations.count(this.Model, {})
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })
}

module.exports = _EndPoints



module.exports = _EndPoints;














