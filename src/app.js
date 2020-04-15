require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, DATABASE_URL } = require('./config')
const feedbackRouter = require('./feedback/feedback-router')
const goalsRouter = require('./goals/goals-router')
const fitnessRouter = require('./fitness/fitness-router')
const weightRouter = require('./weight/weight-router')
const knex = require('knex')
const db = knex({ 
    client: 'pg',
    connection: DATABASE_URL
})

const app = express();

app.set('db', db)

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.get('/login', (req, res) => {
    res.send('Hello, world!')
})

app.use('/feedback', feedbackRouter)
app.use('/goals', goalsRouter)
app.use('/fitness', fitnessRouter)
app.use('/weigh_in', weightRouter)

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app