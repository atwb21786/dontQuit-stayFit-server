
const GoalsService = {
    // getAllGoals(knex){
    //   return knex.select("*").from('goals')
    // },
  
    getById(knex, id) {
      return knex.from('goals').select("*").where('id', id).first()
    },
    insertGoals(knex, goals) {
      return knex.insert(goals)
        .into('goals')
        .returning('*')
        .then(rows =>
          rows[0]
        )
    },
    deleteGoals(knex, id) {
      return knex('goals').where({id}).delete()
    },
    updateGoals(knex, id, goals) {
      return knex('goals').where({id}).update(goals)
    }
    
  }