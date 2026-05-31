# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 7

// Transfer funds between accounts
async function transferFunds(from, to, amount) {
  return knex.transaction(async trx => {
    await trx('accounts').where('id', from).decrement('balance', amount);
    await trx('accounts').where('id', to).increment('balance', amount);
    await trx('transfers').insert({ from, to, amount });
  });
  // Auto-commits on success, rolls back on error
}