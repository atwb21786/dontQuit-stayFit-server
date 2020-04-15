const express = require('express')
const path = require('path')
const xss = require('xss')
const WeightService = require('./weight/weight-service')
const { requireAuth } = require('../middleware/auth')

const weightRouter = express.Router()
const jsonBodyParser = express.json()

const serializeWeight = weight => ({
    id: weight.id,
    content: xss(weight.content),
    date_created: weight.date_created
})

weightRouter
  .route('/')
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      WeightService.getAllWeight(knexInstance)
        .then(weight => {
            res.json(weight.map(serializeWeight))
        })
        .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { id, date_created, content } = req.body
    const newWeight = { id, date_created, content }

    for (const [key, value] of Object.entries(newWeight))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newWeight.weight_id = req.weight.id

    WeightService.insertWeight(
      req.app.get('db'),
      newWeight
    )
      .then(goals => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${weight.id}`))
          .json(WeightService.serializeWeight(goals))
      })
      .catch(next)
    })

    weightRouter
        .route('/:weigh_in_id')
        .all((req, res, next) => {
            WeightService.getById(
                req.app.get('db'),
                req.params.weigh_in_id
            )
                .then(wt => {
                    if(!wt) {
                        return res.status(404).json({
                            error: { message: `Goal doesn't exist`}
                        })
                    }
                    res.wt = wt
                    next()
                })
                .catch(next)
        })
        .get((req, res, next) => {
            res.json(serializeGoals(res.goals))
        })
        .delete((req, res, next) => {
            GoalsService.deleteGoals(
                req.app.get('db'),
                req.params.goals_id
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const { id, date_created, content } = req.body
            const newGoals = { id, date_created, content }

            const numVals = Object.values(newGoals).filter(Boolean).length
            if (numVals === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain either 'id', 'date_created', or 'content'`
                    }
                })

            GoalsService.updateGoals(
                req.app.get('db'),
                req.params.goals_id,
                newGoals
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })

module.exports = goalsRouter