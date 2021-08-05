const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8080;


const app = express();
app.use(cors());

/* Parse URL-encoded bodies (as sent by HTML forms)*/app.use(express.urlencoded({ extended: true }))
// Parse JSON bodies (as sent by API clients)
app.use(express.json());




app.listen(PORT, () => {
    console.log(`Server  running on  ${PORT}.`)
});

app.get("/", (req, res)=>{
    res.send("Server running")
})