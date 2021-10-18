const express = require('express');

const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const _Model = require("../../Actors/_Model");

class _EndPoints{
    constructor(Schema, SchemaOperations) {
        this.Schema = Schema
        this.SchemaOperations = SchemaOperations
        this.SchemaModel = new _Model(Schema)
        console.log("hihihihihi")
        this.router = express.Router();

    }

    create =  this.router.post('/create', async (req, res) => {
        let data  = req.body
        let createOp = await this.SchemaModel.create(data)
        if(createOp.finalResult){
            AnswerHttpRequest.done(res, createOp.result)
        }else {
            AnswerHttpRequest.wrong(res, createOp.error)
        }
    })

    update =  this.router.post('/update/:id', async (req, res) => {
        let {id} = req.params
        let updateOp = await this.SchemaModel.update(id, req.body)
        if(updateOp.finalResult){
            AnswerHttpRequest.done(res, updateOp.result)
        }else {
            AnswerHttpRequest.wrong(res, updateOp.error)
        }
    })

    getAll =  this.router.get('/getAll/:offset/:limit', async (req, res) => {
        let {offset, limit} = req.params
        let getAllOp = await this.SchemaModel.getAll(offset, limit)
        if(getAllOp.finalResult){
            AnswerHttpRequest.done(res, getAllOp.result)
        }else {
            AnswerHttpRequest.wrong(res, getAllOp.error)
        }
    })

    searchBy = this.router.get('/searchBy/:attribute/:value', async (req, res) => {
        let {attribute, value} = req.params
        let stationGeOneOp = await this.SchemaModel.searchBy(attribute, value)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
    })

    count =  this.router.get('/Count', async (req, res)=>{
        let countOp = await this.SchemaModel.count()
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })
}

module.exports = _EndPoints














