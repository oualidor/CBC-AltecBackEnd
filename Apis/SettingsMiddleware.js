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
                AnswerHttpRequest.wrong(res, "System is offline now, try again")
            }
        }else {

            AnswerHttpRequest.wrong(res, "System is offline now, try again")
        }
    }
    catch (error){
        AnswerHttpRequest.wrong(res, "System is offline now, try again")
    }
}

module.exports = SettingsMiddleware