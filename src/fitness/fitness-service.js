
const FitnessService = {
    getAllFitness(knex){
      return knex.select("*").from('fitness')
    },
  
    getById(knex, id) {
      return knex.from('fitness').select("*").where('id', id).first()
    },
    insertFeedback(knex, fitness) {
      return knex.insert(fitness)
        .into('fitness')
        .returning('*')
        .then(rows =>
          rows[0]
        )
    },
    deleteFitness(knex, id) {
      return knex('fitness').where({id}).delete()
    },
    updateFeedback(knex, id, fitness) {
      return knex('fitness').where({id}).update(fitness)
    }
    
  }