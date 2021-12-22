const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");

const Partner = require("../Schemas/Partner");
const PartnerStates = require("../Structures/PartnerStates");
const PartnerMiddleware = {

    byPassStat :  (partner, req, res, next) => {
        try {
            switch (partner.stat){
                case PartnerStates.new.id:
                    AnswerHttpRequest.wrong(res, "This account require administration validation")
                    break;
                case PartnerStates.active.id:
                    next()
                    break;
                case PartnerStates.trusted.id:
                    next()
                    break;
                case PartnerStates.trusted.id:
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
                AnswerHttpRequest.wrong(res, "Partner does not exist")
            }
        } catch (error) {
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    }
}


module.exports = PartnerMiddleware