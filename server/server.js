const express = require('express')
const app = express()
const dotenv = require('dotenv');
const port = process.env.port||3000

dotenv.config();

app.get('/', (req, res) => {
    try{
        res.send('Hello World!')
    }catch(err){
        res.send(err)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})