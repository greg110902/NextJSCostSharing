export function getUserBalances(transactions, users) {
  let userBalances = [];
  users.forEach((user) => {
    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.author === user.id) {
        balance +=
          (transaction.amount * (transaction.affecting.length - 1)) /
          transaction.affecting.length;
      } else if (
        transaction.affecting.includes(user.id) &&
        transaction.author != user.id
      ) {
        balance -= transaction.amount / transaction.affecting.length;
      }
    });
    userBalances.push({ id: user.id, balance: balance });
  });

  return userBalances;
}
