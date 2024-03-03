const jobApplications = [];

function renderJobApplications() {
    const tbody = document.querySelector('table tbody');
    if (jobApplications.length === 0) {
        tbody.innerHTML = `<tr><td colspan="13" class="text-center py-3">No job applications to display.</td></tr>`;
    } else {
        tbody.innerHTML = jobApplications.map(app =>
            `<tr class="hover:bg-gray-100">
                <td class="px-4 py-3">${app.date}</td>
                <td class="px-4 py-3">${app.company}</td>
                <td class="px-4 py-3">${app.position}</td>
                <td class="px-4 py-3">${app.contractType}</td>
                <td class="px-4 py-3">${app.source}</td>
                <td class="px-4 py-3">${app.followUpDate}</td>
                <td class="px-4 py-3">${app.status}</td>
                <td class="px-4 py-3">${app.employerResponse}</td>
                <td class="px-4 py-3">${app.responseMode}</td>
                <td class="px-4 py-3">${app.reasons}</td>
                <td class="px-4 py-3">${app.interview}</td>
                <td class="px-4 py-3">${app.profiles}</td>
                <td class="px-4 py-3">${app.documentsSent}</td>
            </tr>`
        ).join('');
    }
}

// Function to handle form submission
document.getElementById('jobApplicationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newApplication = {};
    for (const [key, value] of formData.entries()) {
        newApplication[key] = value;
    }

    jobApplications.push(newApplication);
    renderJobApplications();
    event.target.reset(); // Reset form after submission
});

// Function to export data to Excel
document.getElementById('exportButton').addEventListener('click', function () {
    const worksheet = XLSX.utils.json_to_sheet(jobApplications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');
    XLSX.writeFile(workbook, 'job_applications.xlsx');
});

// Render job applications on document load
document.addEventListener('DOMContentLoaded', renderJobApplications);
