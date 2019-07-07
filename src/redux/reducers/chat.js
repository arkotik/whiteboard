import { ADD_MESSAGE } from '../actions/chat';

const initialState = [];

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [...state, action.data];
    default:
      return state
  }
}
