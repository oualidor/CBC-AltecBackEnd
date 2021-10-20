const ErrorLog = {
    RentWalletUpdate: (clientId, operation)=>{
        return (JSON.stringify({clientId: clientId, operation: operation}))
    }
}

module.exports = ErrorLog