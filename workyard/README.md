# Workyard's Take Home Project



Hello gentlefolk, I'm Sam. I'm a web developer at Workyard and a medium pace bowler for the Killara Bingles Cricket Club. I'll be guiding you through this take home project.

![alt text](http://res.cloudinary.com/small-change/image/upload/v1512434876/Photo_on_5-12-17_at_11.47_am_n7qew1.jpg)

## The Mission

The mission, should you choose to accept, is to build a "Post a Project" modal in React. We'll POST your new projects to Workyard's staging API. After the project is successfully posted, we'll show all your new projects in a list of very simple cards.

## Getting started on your machine

The first step is to fork this repo so that a fork exists on your own GitHub account. After you have forked the repo, clone your forked version down onto your machine.

Install the repo's dependencies:

`npm install`

Then start a local server:

`npm start`

You should be able to see the boring grey template app on port 8000! Woooo.

Please remember to commit often so we can see how you're tracking...

- - - -
![alt text](http://res.cloudinary.com/small-change/image/upload/v1512441119/Template_qyjvzq.png)

## So, why are we doing this?

This is a tangible way for you to show us:

* That you know react and redux.
* That you're comfortable asking for help when you get stuck and can communicate technical concepts clearly.
* That you're excellent at making web apps look like the designs given to you.
* That you're able to stick to coding conventions in an existing codebase.
* That your code is extendable & easy to read.

## Well, what are Workyard's coding conventions?

* ***Skinny components, fat helpers.*** Put as much complexity as possible into helper files.
  * This make components much easier to read.
* Make mapStateToProps full of helper calls, leave render() as skinny as possible.
  * This make components much easier to read.
* ***Classes over functions.*** Strong preference for react components to be classes connected to the store as opposed to functions.
  * When needs change, refactoring react functions into classes becomes a pain. It's easier to just make components extendable the first time around.
* ***Break related components into a single subfolder in "views"*** 
* ***Component, reducers, actions, scss & css files are camel case*** with the first letter capitalised e.g. Home.js, ProjectActions.js
* ***ClassNames are lowercase*** with hypens e.g. "home-container"
* Styles are done in scss files. We use create-react-app which automatically transpiles Example.scss into a new file in the same directory called Example.css . You can then import Example.css into any component you need.
* ***Use constants*** for string values. If you're doing a string comparison, you probably want to stick what you're comparing your variable to in the `util/Constants.js` file.
* ***1 return statement per file***
  * Again, easier reading. Plus makes code re-use easier.


## The Mission Specs

If you have Sketch, you can download the designs here: https://drive.google.com/a/wurble.com.au/file/d/1X569xGMtO_rYW5BBI2-frOxaacaQZm1K/view?usp=sharing

If you don't have Sketch, here are some images of what we'll be building:

#### Step 1: The Home page (no projects) ####
* Style the bland grey boilerplate to look like the home page below.
- - - -
![alt text](http://res.cloudinary.com/small-change/image/upload/v1512445823/Home_default_gzcp54.png)

#### Step 2: The "Post Project" modal (fields empty) ####
* Clicking the "Create Project" button will open the "Post Project" modal.
* On Workyard's web app, we use http://www.material-ui.com/ quite a bit. You might find their TextField, SelectField & MenuItem are pretty handy.
- - - -
![alt text](http://res.cloudinary.com/small-change/image/upload/v1512449739/Screen_Shot_2017-12-05_at_3.53.18_pm_pqezqo.png)

#### Step 3: The "Post Project" modal (all fields filled) ####
* For the "Project Type" and "Contract Value" drop downs, use the options as defined in `util/Constants.js`.
* For the "Add location" field, please use the Google Places API. The Google Places library has already been imported with our API key in public/index.html.
* For the "Upload photos" field, we use the Uploadcare library. The `openUploadCareDialog` helper in `util/helpers/ProjectHelpers.js` has been provided for you.
* Post the new project Workyard's staging API (see the "Calling our API" section below). The payload should look like:
```
const payload = {
  "suburb": "Mascot",
  "state": "NSW",
  "location_place_id": "ChIJz-9y-iGxEmsRQMAyFmh9AQU",
  "location_lat": -33.9291,
  "location_long": 151.18793000000005,
  "address": "Mascot NSW 2020, Australia",
  "date_unix": 1512447118,
  "description": "Underground services mains to connect 4 new units. Completed electrical through out.",
  "images": [
    "https://ucarecdn.com/52d0be9d-e785-4b3b-9e13-e05f5aba6b02/"
  ],
  "files": [
    "52d0be9d-e785-4b3b-9e13-e05f5aba6b02"
  ],
  "default_image_url": "https://ucarecdn.com/52d0be9d-e785-4b3b-9e13-e05f5aba6b02/",
  "project_type_id": "3",
  "min_contract_value": 2500,
  "max_contract_value": 5000
}
            
```
* If you're POST was successful, it should appear at https://stg.workyard.com/au/projects/nearby (if you're in the US, change "au", to "us" in the URL).
* Our API has some validations on these payload fields
  * suburb: required|between:2,50
  * state: required|between:2,3
  * project_type_id: required|integer
  * min_contract_value: required|integer
  * max_contract_value: required|integer
  * location_lat:required|numeric
  * location_long: required|numeric
  * date_unix: required|numeric
  * address: required|between:1,255
  * description: required|between:10,250
  * default_image_url: required|url|in:{{images_list}}
  * images: required|array
- - - -
![alt text](http://res.cloudinary.com/small-change/image/upload/v1512449739/Screen_Shot_2017-12-05_at_3.53.38_pm_sjjksv.png)

#### Step 4: The Home page (projects posted) ####
* Add new projects that you post to the redux store under the ProjectReducer
- - - -
![alt text](http://res.cloudinary.com/small-change/image/upload/v1512445825/Home_with_projects_vvarvk.png)

## Calling our API

Use the `/util/RestApiClient` to call our API. All requests to our API require two main Header fields:
* Workyard-Agent
  * This is a string that specifies the user's platform, OS, device id, appVersion, screenWidth, screenHeight, devicePixelRatio, debug_flag and country code. Please feel free to ask about this.
* Authorization
  * This specifies whether the the user is requesting a publicly available resource (BASIC authorization) or a privately available resource only accessible to a particular user (BEARER authorization). Again, please ask about this if you have any questions.

## How to get in touch

If you have any questions, concerns or suggestions please feel free to ping me (Sam, the dude in the photo above) on +61432 211 241.
Happy coding! Workyard is a pretty awesome place to work, I hope to see you soon! 

