const express = require('express')
const path = require('path')
const xss = require('xss')
const WeightService = require('./weight-service')
const { requireAuth } = require('../middleware/jwt-auth')

const weightRouter = express.Router()
const jsonBodyParser = express.json()

const serializeWeight = weight => ({
    id: weight.id,
    measurement: xss(weight.measurement),
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
    const { date_created, measurement } = req.body
    const newWeight = { date_created, measurement }

    for (const [key, value] of Object.entries(newWeight))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    WeightService.insertWeight(
      req.app.get('db'),
      newWeight
    )
      .then(wt => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${wt.id}`))
          .json(serializeWeight(wt))
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
                            error: { message: `Weight doesn't exist`}
                        })
                    }
                    res.wt = wt
                    next()
                })
                .catch(next)
        })
        .get((req, res, next) => {
            res.json(serializeWeight(res.weight))
        })
        .delete((req, res, next) => {
            WeightService.deleteWeight(
                req.app.get('db'),
                req.params.weigh_in_id
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonBodyParser, (req, res, next) => {
            const { id, date_created, measurement } = req.body
            const newWeight = { id, date_created, measurement }

            const numVals = Object.values(newWeight).filter(Boolean).length
            if (numVals === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain either 'id', 'date_created', or 'measurement'`
                    }
                })

            WeightService.updateWeight(
                req.app.get('db'),
                req.params.weigh_in_id,
                newWeight
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })

module.exports = weightRouter