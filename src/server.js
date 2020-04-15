require('dotenv').config()

const app = require('./app')
const { PORT, NODE_ENV, DATABASE_URL } = require('./config')

app.listen(PORT, () => {
    console.log(`Server listening in ${NODE_ENV} at http://localhost:${PORT}`)
})