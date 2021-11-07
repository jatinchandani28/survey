const express = require('express');
const cors = require('cors');
const path = require('path')
var app = express();
const bodyParser = require('body-parser');
var apiRouter = require('./src/router/index');

require('dotenv').config()

//use cors 
app.use(cors());

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/test',(req,res)=>{
    res.send('Welcome to the survey project')
})
//Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/v1',apiRouter)

var port = 3000;
app.listen(3000, () => {
    console.log("server start port =>"+ port)
})
