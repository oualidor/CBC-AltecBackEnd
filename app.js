const BackEndExpressServer =require("./BackEndExpressServer");
const {TCP_SERVER} = require("./Apis/Config");
const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const  {PORT} = require("./Apis/Config");
const yitLogger  = require('./Apis/yitLogger')

function main(allowNoTcp, logger){
    let rs = HttpRequestHandler.GET(TCP_SERVER+"HeartBitExpress")
    if(rs == true){
        const backEndExpressServer = new BackEndExpressServer(PORT)
        backEndExpressServer.start()
    }else {
        if(allowNoTcp){
            const backEndExpressServer = new BackEndExpressServer(PORT, logger)
            backEndExpressServer.start()
        }else {
            console.log("coudn not connect to teh TCP server, exitign")
            process.abort()
        }
    }
}


main(true, yitLogger)
