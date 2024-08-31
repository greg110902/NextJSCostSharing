export function getOwingUsers(owed, users) {
  var owedByUsers = [];
  users.forEach((user) => {
    var owedAmount = 0;
    owed.forEach((transaction) => {
      const affectedPeople = transaction.affecting.length;
      if (transaction.affecting.includes(user.id)) {
        owedAmount += transaction.amount / (affectedPeople + 1);
      }
    });
    owedByUsers.push({ id: user.id, value: owedAmount, label: user.firstName });
  });

  return owedByUsers;
}

export function getOwedUsers(owing, users) {
  var owedToUsers = [];
  users.forEach((user) => {
    var owingAmount = 0;
    owing.forEach((transaction) => {
      const affectedPeople = transaction.affecting.length;
      if (user.id === transaction.author) {
        owingAmount += transaction.amount / (affectedPeople + 1);
      }
    });
    owedToUsers.push({
      id: user.id,
      value: owingAmount,
      label: user.firstName,
    });
  });

  return owedToUsers;
}
