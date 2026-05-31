# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 7

// Prisma interactive transactions
const result = await prisma.$transaction(async (tx) => {
  // Check balance
  const account = await tx.account.findUnique({ 
    where: { id: accountId } 
  });
  
  if (account.balance < amount) {
    throw new Error('Insufficient funds');
  }
  
  // Update balance
  const updatedAccount = await tx.account.update({
    where: { id: accountId },
    data: { balance: { decrement: amount } }
  });
  
  // Log transaction
  const txRecord = await tx.transaction.create({
    data: { amount, accountId, type: 'withdrawal' }
  });
  
  return { updatedAccount, txRecord };
});