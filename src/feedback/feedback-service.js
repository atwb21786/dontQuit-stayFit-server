
const FeedbackService = {
  getAllFeedback(knex, userId){
    return knex.select("*").from('feedback').where({ user_id: userId }).orderBy('id')
  },

  getById(knex, id) {
    return knex.from('feedback').select("*").where('id', id).first()
  },
  insertFeedback(knex, feedback) {
    return knex.insert(feedback)
      .into('feedback')
      .returning('*')
      .then(rows =>
        rows[0]
      )
  },
  deleteFeedback(knex, id) {
    return knex('feedback').where({id}).delete()
  },
  updateFeedback(knex, id, feedback) {
    return knex('feedback').where({id}).update(feedback)
  }
  
}

module.exports = FeedbackService
