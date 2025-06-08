import { ADD_PROJECT } from '../util/Constants';

const addProjectToStore = payload => {
  return {
    type: ADD_PROJECT,
    payload
  }
}

export {
  addProjectToStore
}