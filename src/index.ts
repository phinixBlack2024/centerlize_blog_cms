
const dotenv = require('dotenv')
dotenv.config({
  path:'./.env'
})
const PORT = process.env.PORT  
const app = require('./main.js')
app.listen(process.env.PORT || 8000, () => {
    console.log(`server running in port", ${process.env.PORT}`)
})