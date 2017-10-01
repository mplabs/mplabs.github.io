const CLIENT_ID = '173884751768-jmdofrth1520mfu88ogd46oh39er1ka1.apps.googleusercontent.com'
const API_KEY = 'AIzaSyA81rQxebOnXwj5SG1M1j0fCjK8wqLiwbs'
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4'
]
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'

const authorizeButton = document.querySelector('#authorize-button')
const signoutButton = document.querySelector('#signout-button')
const content = document.querySelector('#content')

function handleClientLoad() {
  gapi.load('client:auth2', initClient)
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2
        .getAuthInstance()
        .isSignedIn
        .listen(updateSigninStatus)
      
      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
      authorizeButton.addEventListener('click', (evt) => handleAuthClick(evt))
      signoutButton.addEventListener('click', (evt) => handleSignoutClick(evt))
    }, (error) => console.error(error))
}

/**
 * Calles when the sigin status changes, to update the UI
 * approprietly. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.classList.add('hide')
    signoutButton.classList.remove('hide')
    listMajors()
  } else {
    authorizeButton.classList.remove('hide')
    signoutButton.classList.add('hide')
  }
}

/**
 * Sign in the user upon button click
 */
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn()
}

/**
 * Sign out the user upon button click
 */
function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut()
}

/**
 * Fill the pre element in the body with the given message
 * as its text node. Used to display the results of the API call.
 * 
 * @param {string} message Text to be displayed in pre element.
 */
const appendPre = (message) => content.appendChild(
    document.createTextNode(`${message}\n`))


/**
 * Print the names and majors of students in a simple spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E'})
    .then(response => {
      const range = response.result
      if (range.values.length > 0) {
        appendPre('Name, Major:')
        range.values.forEach(row => appendPre(`${row[0]}, ${row[4]}`))
      } else {
        appendPre('No data found.')
      }
    })
    .catch(err => appendPre(`Error: ${err.message}`))
}
