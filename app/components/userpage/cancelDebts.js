function removeByValue(array, element) {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export default function cancelDebt(owedByUsers, owedToUsers) {
  owedByUsers.forEach((owingUser) => {
    owedToUsers.forEach((owedUser) => {
      if (owingUser.value >= owedUser.value) {
        owingUser.value = owingUser.value - owedUser.value;
      } else if (owedUser.value > owingUser.value) {
        owedUser.value = owedUser.value - owingUser.value;
      }
    });
  });

  return { owedByUsers, owedToUsers };
}
