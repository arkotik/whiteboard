import { SET_DATA, CLEAR_DATA, CLEAR_ALL_DATA } from '../actions/editor';

const initialState = {
  teacher: '',
  student: ''
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA:
      return { ...state, [action.name]: action.data };
    case CLEAR_DATA:
      return { ...state, [action.name]: '' };
    case CLEAR_ALL_DATA:
      return initialState;
    default:
      return state
  }
}
