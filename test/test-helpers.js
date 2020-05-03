const bcrypt = require("bcryptjs")

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'ABC',
            password: '123', 
            date_created: new Date("2020-05-02T13:28:32.615Z"),
            date_modified: new Date("2020-05-02T13:28:32.615Z")
        },
        {
            id: 2,
            user_name: 'DEF',
            password: '456', 
            date_created: new Date("2020-05-02T13:28:32.615Z"),
            date_modified: new Date("2020-05-02T13:28:32.615Z")
        },
        {
            id: 3,
            user_name: 'XYZ',
            password: '789', 
            date_created: new Date("2020-05-02T13:28:32.615Z"),
            date_modified: new Date("2020-05-02T13:28:32.615Z")
        }
        
    ]
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }

module.exports = {
    makeUsersArray,
    seedUsers
}