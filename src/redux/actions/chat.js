export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';

export function addMessage(data) {
  return { type: ADD_MESSAGE, data }
}

export function deleteMessage(id) {
  return { type: DELETE_MESSAGE, id }
}
