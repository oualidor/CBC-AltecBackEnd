/**
 * @return {boolean}
 */
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

module.exports = {email, password};