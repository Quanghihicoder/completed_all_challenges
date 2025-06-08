import Projects from './ProjectReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  projects: Projects
});


export default rootReducer;
