const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");

const Partner = require("../Schemas/Partner");
const PartnerMiddleware = {

    byPassStat :  (partner, req, res, next) => {
        try {
            switch (partner.stat){
                case 0:
                    AnswerHttpRequest.wrong(res, "This account require administration validation")
                    break;
                case 1:
                    next()
                    break;
                case 2:
                    AnswerHttpRequest.wrong(res, "This account has been deactivated by administration")
                    break;
                default:
                    AnswerHttpRequest.wrong(res, "UnKnown Partner stat")

            }
        }
        catch (error){
            console.log(error)
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    },

    validateExistence :  async (id, req, res, next) => {
        try {
            let partner = await Partner.findByPk(id)
            if (partner !== null) {
                req.body.partner = partner
                next(partner)
            } else {
                console.log("hihihi")
                AnswerHttpRequest.wrong(res, partner.error)
            }
        } catch (error) {
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    }
}


module.exports = PartnerMiddleware