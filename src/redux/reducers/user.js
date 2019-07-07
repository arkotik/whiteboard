import { LOGIN_USER, LOGOUT_USER } from '../actions/user';

const initialState = {
  isLoggedIn: false,
  name: '',
  token: ''
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, ...action.data, isLoggedIn: true };
    case LOGOUT_USER:
      return initialState;
    default:
      return state
  }
}
