# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: typescript
# Normalized: ts
# Block index: 8

// Transfer funds between accounts
async function transferFunds(from: number, to: number, amount: number) {
  return db.transaction().execute(async (trx) => {
    await trx
      .updateTable('accounts')
      .where('id', '=', from)
      .set({ balance: eb => eb('balance', '-', amount) })
      .execute();
      
    await trx
      .updateTable('accounts')
      .where('id', '=', to)
      .set({ balance: eb => eb('balance', '+', amount) })
      .execute();
      
    await trx
      .insertInto('transfers')
      .values({ from, to, amount })
      .execute();
  });
  // Auto-commits on success, rolls back on error
}