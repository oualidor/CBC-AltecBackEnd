const BackEndExpressServer =require("./BackEndExpressServer");
const {TCP_SERVER} = require("./Apis/Config");
const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const  {PORT} = require("./Apis/Config");
const yitLogger  = require('./Apis/yitLogger')
const ConsoleMessages = require("./Apis/ConsoleMessages");
function startBackEndServer(port, logger){
    const backEndExpressServer = new BackEndExpressServer(port, logger)
    if(backEndExpressServer.configure()){
        ConsoleMessages.success("Server configured correctly")
        backEndExpressServer.setRouters().then(routesOn => {
            if(routesOn){
                ConsoleMessages.success("Routes configured correctly")
                if(backEndExpressServer.start()){
                    ConsoleMessages.success(`Server  running on  ${PORT}.`)
                }else {
                    ConsoleMessages.heavyError("Server could not start listening correctly , aborting ...")
                }
            }else{
                ConsoleMessages.heavyError("Could not set server routes, aborting ...")
            }
        })

    }else {
        ConsoleMessages.heavyError("Could not configure the server, aborting ...")
    }


}
function main(allowNoTcp, logger){
    ConsoleMessages.log("Attempting to log in as an admin in TCP server")
    let rs = HttpRequestHandler.GET(TCP_SERVER+"HeartBitExpress")
    if(rs == true){
        ConsoleMessages.success("Logged in As Administrator")
        startBackEndServer(PORT, logger)
    }else {
        ConsoleMessages.error("Could not log in in TCP server")
        if(allowNoTcp){
            ConsoleMessages.log("Starting the back end with no TCP is not recommended, you can turn this OFF by passing false to allowNoTcp")
            startBackEndServer(PORT, logger)
        }else {
            ConsoleMessages.error("Aborting the operation, you can try again with No Tcp or contact the development team")
            process.abort()
        }
    }
}


main(true, yitLogger)
