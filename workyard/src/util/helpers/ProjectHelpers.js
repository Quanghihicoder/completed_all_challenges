//-----------------------------------------------------------------------------------------
//----------------------------- Third Party Library imports -------------------------------
//-----------------------------------------------------------------------------------------

import uploadcare from 'uploadcare-widget';
import React from 'react';


//-----------------------------------------------------------------------------------------
//---------------------------------- Internal imports -------------------------------------
//-----------------------------------------------------------------------------------------

import { DEFAULT_UPLOADCARE_SETTINGS, PROJECT_TYPES } from '../Constants';

//-----------------------------------------------------------------------------------------
//------------- Open uploadcare dialog/modal and pass uploaded files to handler -----------
//-----------------------------------------------------------------------------------------

/*

  Inputs: a callback function (called handleUploadedImages)
  The callback, handleUploadedImages, receives a single argument which is an array of object e.g.

  [
    { name: "nameA", url: "urlA" },
    { name: "nameB", url: "urlB" },
    { name: "nameC", url: "urlC" }
  ]

*/



const openUploadCareDialog = handleUploadedImages => {

  // Open the uploadcare dialog
  uploadcare.openDialog(null, DEFAULT_UPLOADCARE_SETTINGS)
  // Fail handler
  .fail(failedUpload => { 
    console.log("upload failed: ", failedUpload);
  })
  // Once modal is closed and files have been converted to url's, fire done handler
  .done(info => {
    const files = info.files();
    const filesLength = files.length;
    const filesArray = [];
    files.forEach(file => {
        file.done(fileInfo => {
            filesArray.push({
                name: fileInfo.name,
                url: fileInfo.originalUrl
            });
            if (filesArray.length === filesLength) {
              // Pass uploaded files to handler 
              handleUploadedImages(filesArray);
            }
        });
    });
  });
}




//-----------------------------------------------------------------------------------------
//---------- Converts the images array from uploadcare to files array for api call  -------
//-----------------------------------------------------------------------------------------

function imagesToFiles(images) {
  let output = [];
  for(let  i = 0; i < images.length; i++) {
    let url = images[i].url;
    let fileIndexStart = url.indexOf('.com/') + 5;
    let fileIndexEnd = url.length - 1;
    output.push(url.substring(fileIndexStart, fileIndexEnd));
  }
  return output;
}

function imagesToImages(images) {
  let output = [];
  for(let  i = 0; i < images.length; i++) {
    let url = images[i].url;
    output.push(url);
  }
  return output;
}

//-----------------------------------------------------------------------------------------
//---------- Converts projects in redux store to divs -------------------------------------
//-----------------------------------------------------------------------------------------

function projectsToDivs(projects) {  
  return(
    projects.map((project, index) => {
      return (
        <div className="project-box" key={index}>
          <div className="project-text">

            <div>{PROJECT_TYPES[project.project_type_id - 1].name}</div>
            <br />
            <div className="project-description">{project.description}</div>
            <br />
            <div>{`$ ${project.min_contract_value}K - ${project.min_contract_value}K`}</div>
            <br />
            <div>{`${project.suburb}, ${project.state}`}</div>

          </div>
        </div>
      )
    })
  )  
}

//-----------------------------------------------------------------------------------------
//------------------ Converts uploaded images to divs -------------------------------------
//-----------------------------------------------------------------------------------------

function imagesToDivs(images) {  
  return (
    images.map((image, index) => {
      return (
        <img src={image} key={index} alt="" />
      )
    })
  )
}

//-----------------------------------------------------------------------------------------
//---------- Validates payload for empty values -------------------------------------------
//-----------------------------------------------------------------------------------------

function validatePayload(payload) {
  let validity = true;
  let empties = [];
  for(var key in payload) {
    if(payload[key].length === 0) {
      empties.push(key);
      validity = false;
    }
  }
  return {validity,empties};
}

//-----------------------------------------------------------------------------------------
//------------- Converts the Home state for workyard API post payload format --------------
//-----------------------------------------------------------------------------------------

function stateToPayload(state) {
  return {
    'suburb' : state.suburb,
    'state' : state.state,
    'location_place_id' : state.location_place_id,
    'location_lat' : state.location_lat,
    'location_long' : state.location_long,
    'address' : state.address,
    'date_unix': Math.round(Date.now() / 1000),
    'description' : state.description,
    'images' : state.images,
    'files' : state.files,
    'default_image_url' : state.default_image_url,
    'project_type_id' : state.project_type_id,
    'min_contract_value' : state.min_contract_value,
    'max_contract_value' : state.max_contract_value,
  }
}


export {
  openUploadCareDialog,
  imagesToFiles,
  stateToPayload,
  imagesToImages,
  validatePayload,
  projectsToDivs,
  imagesToDivs,
}