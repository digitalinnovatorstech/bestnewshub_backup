module.exports.generateUniqueUserName = async (firstName, lastName, userId) => {
  if (!firstName || !userId) throw new Error("Required fields are missing.");

  let lastNameInitial = lastName ? lastName.charAt(0) : firstName.charAt(1);
  const currentYear = new Date().getFullYear();
  let userName = `BNH${currentYear.toString().slice(-2)}${firstName.charAt(
    0
  )}${lastNameInitial}${userId}`;

  return userName?.toUpperCase();
};
