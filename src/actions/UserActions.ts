interface dataInterface {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

const login = (data: dataInterface) => {
  return {
    type: "LOGIN",
    payload: data,
  };
};

const logout = () => {
  return {
    type: "LOGOUT",
  };
};

const failedLogin = () => {
  return {
    type: "FAILED_LOGIN",
  };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  logout,
  failedLogin,
};
