import { ADD_PROJECT } from '../util/Constants';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROJECT:
      return [action.payload, ...state];
    default:
      return state
  }
}