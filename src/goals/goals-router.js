const express = require('express')
const path = require('path')
const xss = require('xss')
const GoalsService = require('./goals-service')
const { requireAuth } = require('../middleware/jwt-auth')

const goalsRouter = express.Router()
const jsonBodyParser = express.json()

const serializeGoals = goals => ({
    id: goals.id,
    content: xss(goals.content),
    date_created: goals.date_created
})

goalsRouter
  .route('/')
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      GoalsService.getAllGoals(knexInstance)
        .then(goal => {
            res.json(goal.map(serializeGoals))
        })
        .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { id, date_created, content } = req.body
    const newGoals = { id, date_created, content }

    for (const [key, value] of Object.entries(newGoals))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newGoals.goal_id = req.goal.id

    GoalsService.insertGoals(
      req.app.get('db'),
      newGoals
    )
      .then(goals => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${goals.id}`))
          .json(GoalsService.serializeGoals(goals))
      })
      .catch(next)
    })

    goalsRouter
        .route('/:goals_id')
        .all((req, res, next) => {
            GoalsService.getById(
                req.app.get('db'),
                req.params.goals_id
            )
                .then(goal => {
                    if(!goal) {
                        return res.status(404).json({
                            error: { message: `Goal doesn't exist`}
                        })
                    }
                    res.goal = goal
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
        .patch(jsonBodyParser, (req, res, next) => {
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