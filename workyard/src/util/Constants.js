//-----------------------------------------------
//---------------- App variables ----------------
//-----------------------------------------------

// Uploadcare
export const DEFAULT_UPLOADCARE_SETTINGS = {
  multiple: true,
  tabs: 'file camera',
  imageShrink: '1920x1440 80%',
  previewStep: true,
  inputAcceptTypes: null
}

// Middleware & RestApiClient
export const BASIC_API_TOKEN = 'YXBwOllYQndPbk5wWlc1dVlUSXdNVEZ6YjJacFlUSXdNVFU9';
export const BEARER_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdGFnaW5nLWFwaS53b3JreWFyZC5jb21cL2xvZ2luX2VtYWlsIiwic3ViIjoyODkzLCJpYXQiOjE1MTY5NTI2MDksImV4cCI6MTUxOTU0NDYwOX0.jzzDe1IfGJ00RZO9Lk2UUZcqcMG9H80stDeOFIcBE0Q'; // Ask Sam for a valid token. This token is how we identify the user making the API call.
export const PRIVACY_TYPE_AUTH = 'auth';
export const PRIVACY_TYPE_BASIC = 'basic';
export const API_URL = "https://staging-api.workyard.com";

// Add Project Modal
export const PROJECT_TYPES = [
  {
    "id": "1",
    "name": "Home Renovation"
  },
  {
    "id": "2",
    "name": "Granny Flat"
  },
  {
    "id": "3",
    "name": "New Home"
  },
  {
    "id": "4",
    "name": "Multi Unit Residential"
  },
  {
    "id": "5",
    "name": "High End Residential"
  },
  {
    "id": "6",
    "name": "Retail"
  },
  {
    "id": "7",
    "name": "Commercial"
  }
];

export const CONTRACT_VALUES = [
  {id: 0, description: '$500 — $1K', min: 500, max: 1000},
  {id: 1, description: '$1K — $2.5K', min: 1000, max: 2500},
  {id: 2, description: '$2.5K — $5K', min: 2500, max: 5000},
  {id: 3, description: '$5K — $10K', min: 5000, max: 10000},
  {id: 4, description: '$10K — $15K', min: 10000, max: 15000},
  {id: 5, description: '$15K — $20K', min: 15000, max: 20000},
  {id: 6, description: '$20K — $30K', min: 20000, max: 30000},
  {id: 7, description: '$30K — $40K', min: 30000, max: 40000},
  {id: 8, description: '$40K — $50K', min: 40000, max: 50000},
  {id: 9, description: '$50K — $75K', min: 50000, max: 75000},
  {id: 10, description: '$75K — $100K', min: 75000, max: 100000},
  {id: 11, description: '$100K — $200K', min: 100000, max: 200000},
  {id: 12, description: '$200K — $300K', min: 200000, max: 300000},
  {id: 13, description: '$400K — $500K', min: 400000, max: 500000},
  {id: 14, description: '$500K — $1M', min: 500000, max: 1000000},
  {id: 15, description: '$1M — $2M', min: 1000000, max: 2000000},
  {id: 16, description: '$2M — $3M', min: 2000000, max: 3000000},
  {id: 17, description: '$3M — $4M', min: 3000000, max: 4000000},
  {id: 18, description: '$4M — $5M+', min: 4000000, max: 5000000}
];

// Project styles 
export const HOME_STYLES = {
  uploadButton: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: 'solid 2px lightgrey',
    borderRadius: '3px',
    width: '170px',
    paddingBottom: '10px',
    color: 'grey',
    lineHeight: '32px',
    marginTop: '25px',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  flatButton: {
    marginLeft: '15px',
    marginRight: 'auto',
    display: 'block',
  },
  customContentStyle: {
    'width': '429px',
    'height': '531px',
  },
  customTitleStyle: {
    'width': '264px',
    'height': '23px',
    fontSize: '18px',
    'color': 'rgb(57, 57, 57)',
    'margin': 'auto',
    textAlign: 'center',
    fontWeight: 'regular',
  }
};

// Test payloads

export const examplePayload = {
  "suburb": "Mascot",
  "state": "NSW",
  "location_place_id": "ChIJz-9y-iGxEmsRQMAyFmh9AQU",
  "location_lat": -33.9291,
  "location_long": 151.18793000000005,
  "address": "Mascot NSW 2020, Australia",
  "date_unix": 1512447118,
  "description": "Jerry Is The Best!!!!",
  "images": [
    "https://www.lamkins.com.sg/images/mega%20bloks%20cool%20construction%20site.jpg"
  ],
  "files": [
    "52d0be9d-e785-4b3b-9e13-e05f5aba6b02"
  ],
  "default_image_url": "https://www.lamkins.com.sg/images/mega%20bloks%20cool%20construction%20site.jpg",
  "project_type_id": "3",
  "min_contract_value": 2500,
  "max_contract_value": 5000
}

//-----------------------------------------------
//---------------- Action names -----------------
//-----------------------------------------------

// Store you action names e.g. ADD_PROJECT, here


export const ADD_PROJECT = "ADD_PROJECT"
