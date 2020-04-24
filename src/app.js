require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const feedbackRouter = require('./feedback/feedback-router')
const goalsRouter = require('./goals/goals-router')
const fitnessRouter = require('./fitness/fitness-router')
const weightRouter = require('./weight/weight-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')


const app = express();



const morganOption = NODE_ENV === 'production'
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.use('/goals', goalsRouter)
app.use('/feedback', feedbackRouter)

app.use('/fitness', fitnessRouter)
app.use('/weigh_in', weightRouter)

app.use(function errorHandler(error, req, res, next) {
    console.error(error.message)
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app