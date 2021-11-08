const jwt  = require('jsonwebtoken');
const SettingOperations = require("../Actors/SettingOperations");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const {jwtPrivateKey} = require("./Config");

const YitAuthenticator = {
    authAll: async (req, res, next) => {
        try {
            let getOneOp = await SettingOperations.getOne("system")
            if(getOneOp.finalResult){
                let systemSetting = getOneOp.result
                if(systemSetting.dataValue === true){
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
    },



    authAdmin:  (req, res, next) => {
        const authHead = req.headers['authorization'];
        const token = authHead && authHead.split(' ')[1];
        if (token == null) {
            res.send({finalResult: false, error: "UnAuthorised"});
        } else {
            jwt.verify(token, jwtPrivateKey, (err, data) => {
                if (err) res.send({finalResult: false, error: err});
                if (data.userType === "Admin") {
                    req.body.email = data.email;
                    req.body.userType = data.userType;
                    next()
                } else {
                    res.send({finalResult: false, error: "UnAuthorised"});
                }
            })
        }
    },

    authClient:  (req, res, next) => {
        const authHead = req.headers['authorization'];
        const token = authHead && authHead.split(' ')[1];
        if (token == null) {
            res.send({finalResult: false, error: "UnAuthorised"});
        } else {
            jwt.verify(token, jwtPrivateKey, (err, data) => {
                if (err) res.send({finalResult: false, error: err});
                if (data.userType === "Client") {
                    req.body.id = data.id;
                    req.body.email = data.email;
                    req.body.userType = data.userType;
                    next()
                } else {
                    res.send({finalResult: false, error: "UnAuthorised"});
                }
            })
        }
    }


}

module.exports = YitAuthenticator;
