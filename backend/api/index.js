const express = require('express');
const connectToDB = require('../db/db');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors'); 
const authRoute = require('../routes/auth.route')
const problemRoute = require('../routes/problem.route')
dotenv.config();

console.log('frontend url ', process.env.FRONTEND_URL)

const corsOptions = {
    // origin: process.env.FRONTEND_URL,
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // credentials: true 
}
app.use(cors(corsOptions));
app.use(express.json()); //parse the req.body data in json format

connectToDB();

//routes 
app.use('/api/user', authRoute)
app.use('/api/problem', problemRoute)

app.get('/', (req, res)=> {
    return res.send('basic setup of backend')
})
app.get('/hii', (req, res)=> {
    return res.send('basic setup of backend hii')
})


app.listen(8080, (req, res)=> {
    console.log('Listening on port ', 8080)
})