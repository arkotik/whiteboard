export const SET_DATA = 'SET_DATA';
export const CLEAR_DATA = 'CLEAR_DATA';
export const CLEAR_ALL_DATA = 'CLEAR_ALL_DATA';

export function setData(name, data) {
  return { type: SET_DATA, name, data }
}

export function clearData(name) {
  return { type: CLEAR_DATA, name }
}

export function clearAllData() {
  return { type: CLEAR_ALL_DATA }
}
