![Dependencies](https://david-dm.org/animenl/portal.svg) ![devDependencies](https://david-dm.org/animenl/portal/dev-status.svg)

# Volunteer Portal
This is the front-end code for the [AnimeCon](https://animecon.nl/) Volunteer Portal. It's written
in TypeScript and depends on [React](https://reactjs.org/), [Material UI](https://material-ui.com/)
and various other packages that can be found in [package.json](package.json).

## Installation
Installing the volunteer portal for local development is straightforward, and does not require any
dependencies external to those provided by this repository. Development can be done on any platform.

  1. Clone the repository to a local directory.
  1. Run the `npm install` command in this directory to pull in the dependencies.
  1. Run the `npm start` command to start working from a local server. (With file watch.)

## Deployment
TODO

## API Requests
The volunteer portal requires a number of API calls in order to work properly. They can be provided
by any back-end, but must follow certain documented semantics.

  * [/api/content](API.md#apicontent)
  * [/api/environment](API.md#apienvironment)
  * [/api/login](API.md#apilogin)
  * [/api/event](API.md#apievent)
  * [/api/registration](API.md#apiregistration)
  * [/api/upload](API.md#apiupload)
