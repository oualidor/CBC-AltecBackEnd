const express = require('express');

const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const _Model = require("../../Actors/_Model");


const _EndPoints = (Schema, SchemaOperations)=>{
    const router = express.Router();
    const SchemaModel = new _Model(Schema)
    router.post('/create', async (req, res) => {
        let data  = req.body
        let createOp = await SchemaModel.create(data)
        if(createOp.finalResult){
            AnswerHttpRequest.done(res, createOp.result)
        }else {
            AnswerHttpRequest.wrong(res, createOp.error)
        }
    })

    router.post('/update/:id', async (req, res) => {
        let {id} = req.params
        let updateOp = await SchemaModel.update(id, req.body)
        if(updateOp.finalResult){
            AnswerHttpRequest.done(res, updateOp.result)
        }else {
            AnswerHttpRequest.wrong(res, updateOp.error)
        }
    })

    router.get('/getAll/:offset/:limit', async (req, res) => {
        let {offset, limit} = req.params
        let getAllOp = await SchemaModel.getAll(offset, limit)
        if(getAllOp.finalResult){
            AnswerHttpRequest.done(res, getAllOp.result)
        }else {
            AnswerHttpRequest.wrong(res, getAllOp.error)
        }
    })

    router.get('/searchBy/:attribute/:value', async (req, res) => {
        let {attribute, value} = req.params
        let stationGeOneOp = await SchemaModel.searchBy(attribute, value)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
    })

    router.get('/Count', async (req, res)=>{
        let countOp = await SchemaModel.count()
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })


    router.get('/CountWhere/:attribute/:value', async (req, res)=>{
        let {attribute, value} = req.params
        let countOp = await SchemaModel.countWhere(attribute, value)
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })

    return(router)
}

module.exports = _EndPoints














