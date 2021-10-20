const ErrorLog = {
    WalletUpdate:{
        rent: (clientId, operation, )=>{
            return (JSON.stringify({clientId: clientId, operation: operation, details}))
        },
        recharge: (clientId, reCodeId, details)=>{
            return (JSON.stringify({clientId: clientId,  reCodeId, details}))
        },
        reFund: (clientId,  oldBalance, details)=>{
            return (JSON.stringify({clientId: clientId, oldBalance,  details}))
        },
    },

    Transaction:{
        rent: (stationId, powerBankId, clientId, details)=>{
            return (JSON.stringify({stationId, powerBankId, clientId, details}))
        },
        recharge: (clientId, reCodeId, details)=>{
            return (JSON.stringify({clientId, reCodeId, details}))
        },
    }
}


module.exports = ErrorLog