const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const journalistRouter = require('./routers/journalist')
const reportsRouter = require('./routers/reports')

// connect db
require('./db/mongoose')
app.use(express.json())

app.use(journalistRouter)
app.use(reportsRouter)

/***********************************************/
app.listen(port,()=>{
    console.log('Server is running ' + port )
})