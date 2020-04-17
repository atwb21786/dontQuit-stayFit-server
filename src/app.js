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
const GoalsService = require('./goals/goals-service')
const FitnessService = require('./fitness/fitness-service')
const FeedbackService = require('./feedback/feedback-service')
const WeightService = require('./weight/weight-service')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
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

app.get('/goals', (req, res, next) => {
    const knexInstance = req.app.get('db')
    GoalsService.getAllGoals(knexInstance)
      .then(goal => {
        res.json(goal)
      })
      .catch(next)
  })

app.get('/goals/:goals_id', (req, res, next) => {
const knexInstance = req.app.get('db')
GoalsService.getById(knexInstance, req.params.goals_id)
    .then(goal => {
    res.json(goal)
    })
    .catch(next)
})

app.get('/fitness', (req, res, next) => {
    const knexInstance = req.app.get('db')
    FitnessService.getAllFitness(knexInstance)
      .then(fit => {
        res.json(fit)
      })
      .catch(next)
  })

app.get('/fitness/:fitness_id', (req, res, next) => {
const knexInstance = req.app.get('db')
FitnessService.getById(knexInstance, req.params.fitness_id)
    .then(fit => {
    res.json(fit)
    })
    .catch(next)
})

app.get('/feedback', (req, res, next) => {
    const knexInstance = req.app.get('db')
    FeedbackService.getAllFeedback(knexInstance)
      .then(fb => {
        res.json(fb)
      })
      .catch(next)
  })

app.get('/feedback/:feedback_id', (req, res, next) => {
const knexInstance = req.app.get('db')
FeedbackService.getById(knexInstance, req.params.feedback_id)
    .then(fb => {
    res.json(fb)
    })
    .catch(next)
})

app.get('/weigh_in', (req, res, next) => {
    const knexInstance = req.app.get('db')
    WeightService.getAllWeight(knexInstance)
      .then(wt => {
        res.json(wt)
      })
      .catch(next)
  })

app.get('/weigh_in/:weigh_in_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    WeightService.getById(knexInstance, req.params.weigh_in_id)
        .then(wt => {
        res.json(wt)
        })
        .catch(next)
    })

app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.use('/goals', goalsRouter)
app.use('/feedback', feedbackRouter)

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