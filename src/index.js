const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require('cors')
const journalistRouter = require('./routers/journalist')
const reportsRouter = require('./routers/reports')

// connect db
require('./db/mongoose')
app.use(express.json())

app.use(cors())
app.use(journalistRouter)
app.use(reportsRouter)

/***********************************************/
app.listen(port,()=>{
    console.log('Server is running ' + port )
})