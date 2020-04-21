
const WeightService = {
    getAllWeight(knex){
      return knex.select("*").from('weigh_in').orderBy('id')
    },
  
    getById(knex, id) {
      return knex.from('weigh_in').select("*").where('id', id).first()
    },
    insertWeight(knex, weight) {
      return knex.insert(weight)
        .into('weigh_in')
        .returning('*')
        .then(rows =>
          rows[0]
        )
    },
    deleteWeight(knex, id) {
      return knex('weigh_in').where({id}).delete()
    },
    updateWeight(knex, id, weight) {
      return knex('weigh_in').where({id}).update(weight)
    }
    
  }

  module.exports = WeightService