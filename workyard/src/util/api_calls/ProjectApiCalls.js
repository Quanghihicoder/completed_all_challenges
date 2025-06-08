import RestApiClient from './RestApiClient';

//------------------------------------------------------------------------------
//-------------------------- Add a Project API Call-----------------------------
//------------------------------------------------------------------------------

const addProject = (newProjectPayload, store, successCallback) => {
  RestApiClient({
    relativeUrl: '/v1/me/project',
    type: 'POST',
    store: store,
    payload: newProjectPayload,
    successCallback
  });
}

export {
  addProject,
}