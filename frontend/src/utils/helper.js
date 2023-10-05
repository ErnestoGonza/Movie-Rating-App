export const validateEmail = (email) => {
  const isValid =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return isValid.test(email);
};

export const isValidPassword = (password) => {
  return password.length < 8 || password.length > 20 ? false : true;
};

export const validateName = (name) => {
  const isValidName = /^[a-z A-Z]+$/;

  return isValidName.test(name);
};
