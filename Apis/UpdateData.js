


const UpdateData = (data) =>{
        for(let attr in data){
            if(data[attr] != undefined && data[attr] != null && data[attr] != ""){

            }else {

                delete data[attr]
            }
        }
        return data
}



module.exports = { UpdateData }
