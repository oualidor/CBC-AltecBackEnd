import SERVER from "../Apis/GlobalConfig";
const MODEL = "Station/"

class Teacher {

    constructor() {

    }

    create = async(postData) =>{
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData)
        };

        const response = await fetch(SERVER+MODEL+"/create/", requestOptions);
        const data = await response.json();
        if(data.finalResult == true){
            alert("done")
        }else{
            alert("wrong")
        }
    }

    async getAll() {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        const response = await fetch(SERVER+MODEL+"getAll/0/99999", requestOptions);
        const data = await response.json();
        if (data.finalResult == true) {
            return data.result;
        } else {
            return null;
        }
    }

    async getOnById(id) {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        const response = await fetch(SERVER+MODEL+"getOne/"+id, requestOptions);
        const data = await response.json();
        if (data.finalResult == true) {
            return data.result;
        } else {
            return null;
        }
    }

    validateCustomer = async(id) =>{
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        const response = await fetch(SERVER+"Teacher/validate/"+id, requestOptions);
        const data = await response.json();
        if(data.finalResult == true){
            alert("done")
        }else{
            alert("wrong")
        }
    }

}

const _Station = new Teacher();
export default _Station;