export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export function loginUser(data) {
  return { type: LOGIN_USER, data }
}

export function logoutUser() {
  return { type: LOGOUT_USER }
}
