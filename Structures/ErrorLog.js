const ErrorLog = {
    WalletUpdate:{
        rent: (clientId, operation, )=>{
            return (JSON.stringify({clientId: clientId, operation: operation, details}))
        },
        recharge: (clientId, operation, details)=>{
            return (JSON.stringify({clientId: clientId, operation: operation, details}))
        },

        reFund: (clientId,  oldBalance, details)=>{
            return (JSON.stringify({clientId: clientId, oldBalance,  details}))
        },
    },

    Transaction:{
        rent: (stationId, powerBankId, clientId)=>{
            return (JSON.stringify({stationId, powerBankId, clientId}))
        },
        recharge: (clientId, operation, details)=>{
            return (JSON.stringify({clientId: clientId, operation: operation, details}))
        },

        reFund: (clientId,  oldBalance, details)=>{
            return (JSON.stringify({clientId: clientId, oldBalance,  details}))
        },
    }
}


module.exports = ErrorLog