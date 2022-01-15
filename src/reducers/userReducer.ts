import { AnyAction } from "redux";

interface initialStateInterface {
  loggedIn: boolean;
  loggingIn: Boolean;
  id?: string;
  username?: string;
  avatar?: string;
  discriminator?: string;
}

const initialState: initialStateInterface = {
  loggedIn: false,
  loggingIn: true,
};

const data = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        id: action.payload.id,
        username: action.payload.username,
        avatar: action.payload.avatar,
        discriminator: action.payload.discriminator,
      };
    case "LOGOUT":
      return {
        ...state,
        ...initialState,
        loggingIn: false,
      };
    case "FAILED_LOGIN":
      return {
        ...state,
        ...initialState,
        loggingIn: false,
      };
    default:
      return {
        ...state,
        ...initialState,
      };
  }
};

export default data;
