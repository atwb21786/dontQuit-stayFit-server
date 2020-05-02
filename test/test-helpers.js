const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'ABC',
            password: 123, 
            date_created: new Date("2020-05-02T13:28:32.615Z"),
            date_modified: new Date("2020-05-02T13:28:32.615Z")
        },
        {
            id: 2,
            user_name: 'DEF',
            password: 456, 
            date_created: new Date("2020-05-02T13:28:32.615Z"),
            date_modified: new Date("2020-05-02T13:28:32.615Z")
        },
        {
            id: 3,
            user_name: 'XYZ',
            password: 789, 
            date_created: new Date("2020-05-02T13:28:32.615Z"),
            date_modified: new Date("2020-05-02T13:28:32.615Z")
        }
        
    ]
}

module.exports = {
    makeUsersArray
}