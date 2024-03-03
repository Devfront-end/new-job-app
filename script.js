// Array to store job application entries
const jobApplications = [];

// Render job applications in the table
function renderJobApplications() {
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = jobApplications.length === 0 ?
    `<tr><td colspan="13" class="text-center">No job applications to display.</td></tr>` :
    jobApplications.map(app => 
      `<tr>
        <td>${app.date}</td>
        <td>${app.company}</td>
        <td>${app.position}</td>
        <td>${app.contractType}</td>
        <td>${app.source}</td>
        <td>${app.followUpDate}</td>
        <td>${app.status}</td>
        <td>${app.employerResponse}</td>
        <td>${app.responseMode}</td>
        <td>${app.reasons}</td>
        <td>${app.interview}</td>
        <td>${app.profiles}</td>
        <td>${app.documentsSent}</td>
      </tr>`
    ).join('');
}

// Handle form submission
document.getElementById('my-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newApplication = {};
  const googleSheetData = [];

  for (const [key, value] of formData.entries()) {
    if (!value.trim()) {
      alert(`Please fill in the ${key} field.`);
      return;
    }
    newApplication[key] = value;
    googleSheetData.push(value);
  }

  jobApplications.push(newApplication);
  renderJobApplications();
  try {
    await appendDataToSheet([googleSheetData]);
    alert('Data successfully added to Google Sheet.');
  } catch (error) {
    console.error('Error appending data to Google Sheet:', error);
    alert('Failed to add data to Google Sheet.');
  }

  event.target.reset();
});

// Append data to Google Sheet
async function appendDataToSheet(data) {
  if (!gapi.client) {
    throw new Error('Google API client not initialized');
  }
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    throw new Error('User not signed in');
  }

  const sheetId = '';
  const range = 'Sheet1!A1:Z';
  const valueRangeBody = { values: data };
  const response = await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: valueRangeBody,
  });
  return response;
}

// Initialize Google API client
function initClient() {
  gapi.client.init({
    apiKey: '',
    clientId: '',
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, function(error) {
    console.error('Error initializing GAPI client:', error);
  });
}

// Update UI based on sign-in status
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    console.log('User is signed in');
  } else {
    console.log('User is not signed in');
    gapi.auth2.getAuthInstance().signIn();
  }
}

// Load the Google Sheets API client library and initialize the GAPI client
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
