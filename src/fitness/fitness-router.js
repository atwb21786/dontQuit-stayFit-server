const express = require('express')
const path = require('path')
const xss = require('xss')
const FitnessService = require('./fitness-service')
const { requireAuth } = require('../middleware/jwt-auth')

const fitnessRouter = express.Router()
const jsonBodyParser = express.json()

const serializeFitness = fitness => ({
    id: fitness.id,
    content: xss(fitness.content),
    date_created: fitness.date_created,
    user_id: fitness.user_id
})

fitnessRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      FitnessService.getAllFitness(knexInstance, req.user.id)
        .then(fit => {
            res.json(fit.map(serializeFitness))
        })
        .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { date_created, content } = req.body
    const newFitness = { date_created, content, user_id: req.user.id }

    for (const [key, value] of Object.entries(newFitness))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    FitnessService.insertFitness(
      req.app.get('db'),
      newFitness
    )
      .then(fitness => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${fitness.id}`))
          .json(serializeFitness(fitness))
      })
      .catch(next)
    })

    fitnessRouter
        .route('/:fitness_id')
        .all(requireAuth)
        .all((req, res, next) => {
            FitnessService.getById(
                req.app.get('db'),
                req.params.fitness_id
            )
                .then(fitness => {
                    if(!fitness) {
                        return res.status(404).json({
                            error: { message: `Fitness doesn't exist`}
                        })
                    }
                    res.fitness = fitness
                    next()
                })
                .catch(next)
        })
        .get((req, res, next) => {
            res.json(serializeFitness(res.fitness))
        })
        .delete((req, res, next) => {
            FitnessService.deleteFitness(
                req.app.get('db'),
                req.params.fitness_id
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonBodyParser, (req, res, next) => {
            const { id, date_created, content } = req.body
            const newFitness = { id, date_created, content, user_id: req.user.id }

            const numVals = Object.values(newFitness).filter(Boolean).length
            if (numVals === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain either 'id', 'date_created', or 'content'`
                    }
                })

            FitnessService.updateFitness(
                req.app.get('db'),
                req.params.fitness_id,
                newFitness
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })

module.exports = fitnessRouter