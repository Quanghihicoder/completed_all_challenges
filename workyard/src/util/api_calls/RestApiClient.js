// -----------------------------------------------------------------------------------------------
// ---------------------------------------- Imports ----------------------------------------------
// -----------------------------------------------------------------------------------------------

import {
  defaultCatchCallback,
  buildWorkyardHeaders,
  generateUrl,
  generateRequest,
} from '../helpers/MiddlewareHelpers';

import { PRIVACY_TYPE_AUTH } from '../Constants';

// -----------------------------------------------------------------------------------------------
// -------------------------------------- RestApiClient ------------------------------------------
// -----------------------------------------------------------------------------------------------

const RestApiClient = ({
    relativeUrl,
    successCallback = res => res,
    type = 'GET',
    privacyType = PRIVACY_TYPE_AUTH,
    catchCallback = defaultCatchCallback,
    payload = {},
  }) => { 

  // -------------------------------------------------------------------------------
  // ---------------------- Build headers, url and request -------------------------
  // -------------------------------------------------------------------------------
  
  const headers = buildWorkyardHeaders(privacyType);
  const url = generateUrl(relativeUrl);
  const request = generateRequest(url, type, headers, payload);

  // -------------------------------------------------------------------------------
  // ------------------------------- Make API call ---------------------------------
  // -------------------------------------------------------------------------------

  fetch(request).then(response => {
    // Token expired.
    if (response.status === 401) { 
      console.error("Token is invalid. response: ", response)
      return;
    } 
    // API logic error. Pass error to "catch" callback.
    else if (!response.ok  && response.status !== 400) {
      throw Error(response);
    }
    // API success. Pass to next "then" callback.
    return response.json();
  })
  .then(response => {      
    // On 401's, the response is undefined. 
    if (response === undefined) {
      return;
    }
    // There is a validation error with your payload.
    else if (response.error_code) {
      console.log("Validation error: ", response);
      catchCallback(response);
    }
    // Success callback.
    else {
      successCallback(response);
    }
  })
  .catch((e) => {
    // Handle an API logic error.
    catchCallback(e);
  })
};


export default RestApiClient;