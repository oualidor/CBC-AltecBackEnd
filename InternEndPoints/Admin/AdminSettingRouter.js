const express = require('express');
const _EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
const Setting = require("../../Schemas/Setting");
const SettingOperations = require("../../Actors/SettingOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const AdminSettingRouter = express.Router();

AdminSettingRouter.use('/', _EndPoints(Setting, SettingOperations)),

AdminSettingRouter.get('/getOne/:name', async (req, res) => {
    let {name} = req.params
    let getOneOp = await SettingOperations.getOne(name)
    if(getOneOp.finalResult){
        AnswerHttpRequest.done(res, getOneOp.result)
    }
    else{
        AnswerHttpRequest.wrong(res, getOneOp.error)
    }
}),



module.exports = AdminSettingRouter;














