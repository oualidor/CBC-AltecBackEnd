const ExpressResult = (finalResult, result)=>{
    if(finalResult) return {finalResult: finalResult, result: result}
    return {finalResult: false, error: result}
}


const AnswerHttpRequest  = {
    done: (res, result)=>{
        res.send(ExpressResult(true, result))
    },
    wrong: (res, error)=>{
        res.send(ExpressResult(false, error))
    }
}
module.exports = AnswerHttpRequest