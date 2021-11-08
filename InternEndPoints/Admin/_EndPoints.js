const express = require('express');

const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const GlobalOperations = require("../../Actors/GlobalOperations");


const _EndPoints = (Model)=>{
    const router = express.Router();
    const globalOperations = new GlobalOperations(Model)

    router.post('/create', async (req, res) => {
        let data  = req.body
        let createOp = await globalOperations.create(data)
        if(createOp.finalResult){
            AnswerHttpRequest.done(res, createOp.result)
        }else {
            AnswerHttpRequest.wrong(res, createOp.error)
        }
    })

    router.post('/update/:id', async (req, res) => {
        let {id} = req.params
        let updateOp = await globalOperations.update(id, req.body)
        if(updateOp.finalResult){
            AnswerHttpRequest.done(res, updateOp.result)
        }else {
            AnswerHttpRequest.wrong(res, updateOp.error)
        }
    })

    router.get('/getAll/:offset/:limit', async (req, res) => {
        let {offset, limit} = req.params
        console.log(offset)
        let getAllOp = await globalOperations.getAll(offset, limit)
        if(getAllOp.finalResult){
            console.log(getAllOp.result)
            AnswerHttpRequest.done(res, getAllOp.result)
        }else {
            AnswerHttpRequest.wrong(res, getAllOp.error)
        }
    })

    router.get('/searchBy/:attribute/:value', async (req, res) => {
        let {attribute, value} = req.params
        let stationGeOneOp = await globalOperations.searchBy(attribute, value)
        if(stationGeOneOp.finalResult){
            AnswerHttpRequest.done(res, stationGeOneOp.result)
        }
        else{
            AnswerHttpRequest.wrong(res, stationGeOneOp.error)
        }
    })

    router.get('/Count', async (req, res)=>{
        let countOp = await globalOperations.count()
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })

    router.get('/CountWhere/:attribute/:value', async (req, res)=>{
        let {attribute, value} = req.params
        let countOp = await globalOperations.count(attribute, value)
        if(countOp.finalResult){
            AnswerHttpRequest.done(res, countOp.result)
        }else {
            AnswerHttpRequest.wrong(res, countOp.error)
        }
    })

    router.get('/delete/:id', async (req, res)=>{
        let {id } = req.params
        let deleteOp = await globalOperations.delete(id)
        if(deleteOp.finalResult){
            AnswerHttpRequest.done(res, deleteOp.result)
        }else {
            AnswerHttpRequest.wrong(res, deleteOp.error)
        }
    })

    return(router)
}

module.exports = _EndPoints














