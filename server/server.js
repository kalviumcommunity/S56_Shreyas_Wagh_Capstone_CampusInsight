const express = require('express')
const Router = require('./routes.js')
const { isConnected, connected } = require('./db.js'); 
const cors=require('cors')
const app = express()
const port = process.env.PORT||3000
const dotenv = require('dotenv');

app.use(cors());
app.use(express.json())

app.set("trust proxy", true); 

app.get('/', (req, res) => {
     try {
        res.json({
            database: isConnected() ? 'connected' : 'disconnected'
        });
    } catch (err) {
        console.log(err);
    }
});
app.use(Router); 

if (require.main === module) {
    connected()
    app.listen(port, async () => {
        console.log(`🚀 server running on PORT: ${port}`);
    });
}