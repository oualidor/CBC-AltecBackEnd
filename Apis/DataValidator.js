

const Global = (data) =>{
    /*** @return {{finalResult: boolean, data: string}}*/
    let error = ""
    let isError = false
    for(let attr in data) {
        if (data[attr] !== undefined || data[attr] !== null || data[attr] !== "") {
            error += data[attr]+ " cant be null "
            isError = true
        }
    }
    return {finalResult: isError, data: error}
}
const isLongitude = (x)=>{
    if (x == null) return false
    if (x == undefined) return false
}
function email(mail) {
    if (mail == null) return false
    if (mail == undefined) return false
    if(mail.length == 0) return false
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
        return true;
    }
    return false;
}

function password(pass){
    if (pass == null) return false
    if (pass == undefined) return false
    if(pass.length == 0) return false
    return true
}

module.exports = {Global, email, password};