const express = require('express')
const path = require('path')
const xss = require('xss')
const FeedbackService = require('./feedback-service')
const { requireAuth } = require('../middleware/jwt-auth')

const feedbackRouter = express.Router()
const jsonBodyParser = express.json()

const serializeFeedback = feedback => ({
    id: feedback.id,
    content: xss(feedback.content),
    date_created: feedback.date_created,
    user_id: feedback.user_id
})

feedbackRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      FeedbackService.getAllFeedback(knexInstance, req.user.id)
        .then(fb => {
            res.json(fb.map(serializeFeedback))
        })
        .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { date_created, content } = req.body
    const newFeedback = { date_created, content, user_id: req.user.id }

    for (const [key, value] of Object.entries(newFeedback))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    FeedbackService.insertFeedback(
      req.app.get('db'),
      newFeedback
    )
      .then(feedback => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${feedback.id}`))
          .json(serializeFeedback(feedback))
      })
      .catch(next)
    })

    feedbackRouter
        .route('/:feedback_id')
        .all(requireAuth)
        .all((req, res, next) => {
            FeedbackService.getById(
                req.app.get('db'),
                req.params.feedback_id
            )
                .then(feedback => {
                    if(!feedback) {
                        return res.status(404).json({
                            error: { message: `Feedback doesn't exist`}
                        })
                    }
                    res.feedback = feedback
                    next()
                })
                .catch(next)
        })
        .get((req, res, next) => {
            res.json(serializeFeedback(res.feedback))
        })
        .delete((req, res, next) => {
            FeedbackService.deleteFeedback(
                req.app.get('db'),
                req.params.feedback_id
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonBodyParser, (req, res, next) => {
            const { id, date_created, content } = req.body
            const newFeedback = { id, date_created, content, user_id: req.user.id }

            const numVals = Object.values(newFeedback).filter(Boolean).length
            if (numVals === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain either 'id', 'date_created', or 'content'`
                    }
                })

            FeedbackService.updateFeedback(
                req.app.get('db'),
                req.params.feedback_id,
                newFeedback
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })

module.exports = feedbackRouter