const express= require('express');
const http = require("http");
const { Server } = require("socket.io");

const bodyParser=require('body-parser');
const cors=require('cors');
const credentials=require('dotenv').config();
const connection=require('./config/dbConfig');

const signuproute= require('./Routes/signup');
const loginroute=require('./Routes/login');
const userroute=require('./Routes/user');
const eduroute=require('./Routes/user_education_profile');
const app= express();
 const server = http.createServer(app);

const Port=3000;


connection();
require("./webSocket/sender")(server);

app.get("/", (req, res) => {
    res.send("HTTP Server is running!");
});


app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("/uploads", express.static("uploads"));


app.use('/sign',signuproute);
app.use('/login', loginroute);
app.use('/fetch',userroute);
app.use('/edu',eduroute);





server.listen(3000, ()=>{
    console.log(`Server is running at Port : ${Port}`);
    
})