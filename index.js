var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

const mongoURI = 'mongodb://xxxxx@ds145694.mlab.com:45694/earninjiit'

mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))
   

var Users = require('./routes/User')

app.use('/users', Users)

app.use(express.static(__dirname+'/public/'));
app.get(/.*/,(req,res)=>res.sendFile(__dirname+'/public/index.html'));

app.listen(port, function () {
    console.log("Server is running on port: " + port)
})
