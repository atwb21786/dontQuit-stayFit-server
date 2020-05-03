const knex = require('knex')
const app = require('../src/app')
const jwt = require("jsonwebtoken")
const { makeUsersArray, seedUsers } = require('./test-helpers')

describe('Auth Endpoints', function() {
    let db
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE;'))

    afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE;'))

    const users = makeUsersArray();

    describe('POST /auth/login', () => {
        beforeEach('insert users', () => {
            return seedUsers(
                db,
                users
            )
        })

        it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
            const userValidCreds = {
              user_name: users[0].user_name,
              password: users[0].password,
            }
            const expectedToken = jwt.sign(
              { user_id: users[0].id }, // payload
              process.env.JWT_SECRET,
              {
                subject: users[0].user_name,
                algorithm: 'HS256',
              }
            )
            return supertest(app)
              .post('/auth/login')
              .send(userValidCreds)
              .expect(200, {
                authToken: expectedToken,
              })
          })
      })
})