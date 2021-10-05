const GlOpResult  = (finalResult, result) =>{
    if(finalResult){
        return ({finalResult: finalResult, result: result})
    }else {
        return ({finalResult: finalResult, error: result})
    }
}

module.exports = GlOpResult