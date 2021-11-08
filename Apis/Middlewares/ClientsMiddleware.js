const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const ClientOperations = require("../../Actors/ClientOperations");
const ClientsMiddleware = {

    byPassStat :  (client, req, res, next) => {
        try {
            switch (client.stat){
                case 0:
                    AnswerHttpRequest.wrong(res, "This account require administration validation")
                    break;
                case 1:
                    next()
                    break;
                case 2:
                    AnswerHttpRequest.wrong(res, "This account has been deactivated by administration")
                default:
                    AnswerHttpRequest.wrong(res, "Operation failed")

            }
        }
        catch (error){
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    },

    validateExistence :  async (id, req, res, next) => {
        try {
            let getClientOp = await ClientOperations.findByPk(id)
            if (getClientOp.finalResult) {
                let client = getClientOp.result
                req.body.client = client
                next(client)
            } else {
                AnswerHttpRequest.wrong(res, getClientOp.error)
            }
        } catch (error) {
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    }
}


module.exports = ClientsMiddleware