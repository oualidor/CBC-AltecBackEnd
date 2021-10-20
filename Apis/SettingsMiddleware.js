const SettingOperations = require("../Actors/SettingOperations");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const SettingsMiddleware = async (name, value, req, res, next) => {
    try {
        let getOneOp = await SettingOperations.getOne(name)
        if(getOneOp.finalResult){
            let systemSetting = getOneOp.result
            if(systemSetting.dataValue === value){
                next()
            }else {
                AnswerHttpRequest.wrong(res, "Operation not temporarily not permitted")
            }
        }else {
            AnswerHttpRequest.wrong(res, "Operation not temporarily not permitted")
        }
    }
    catch (error){
        AnswerHttpRequest.wrong(res, "Operation not temporarily not permitted")
    }
}

module.exports = SettingsMiddleware