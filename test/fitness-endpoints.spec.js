const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Fitness Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('fitness').truncate())

    afterEach('cleanup', () => db('fitness').truncate())

    context('Given there are workouts logged in the database', () => {
        const workout = [
            {
                id: 1,
                content: 'Go for a run!',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 2,
                content: 'Go to the gym',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 3,
                content: 'Workout with the boxflex',
                date_created: '2029-01-22T16:28:32.615Z'
            }
        ];

        this.beforeEach('insert fitness workouts', () => {
            return db
                .into('fitness')
                .insert(workout)
        })

        it('GET /fitness responds with 200 and all the fitness workouts', () => {
            return supertest(app)
                .get('/fitness')
                .expect(200, workout)
        })

        it('GET /fitness/:fitness_id responds with 200 and the specified workout', () => {
            const workoutId = 2
            const expectedWorkout = workout[workoutId - 1]
            return supertest(app)
                .get(`/fitness/${workoutId}`)
                .expect(200, expectedWorkout)
        })
    })
})