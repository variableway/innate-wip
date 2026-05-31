# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 8

// Drizzle transactions
const result = await db.transaction(async (tx) => {
  // Check balance
  const [account] = await tx.select()
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);
  
  if (!account || account.balance < amount) {
    throw new Error('Insufficient funds');
  }
  
  // Update balance with SQL expression
  await tx.update(accounts)
    .set({ 
      balance: sql`${accounts.balance} - ${amount}` 
    })
    .where(eq(accounts.id, accountId));
  
  // Log transaction
  const [txRecord] = await tx.insert(transactions)
    .values({ amount, accountId, type: 'withdrawal' })
    .returning();
  
  return { account, txRecord };
});