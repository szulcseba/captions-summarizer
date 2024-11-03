import './lib/marked.min.js';


document.addEventListener('DOMContentLoaded', function() {
    loadSummaries();
});

function loadSummaries() {
    chrome.storage.sync.get({ VideoSummary: {} }, function(result) {
        console.log(result.VideoSummary);
        const summaries = result.VideoSummary;
        const summaryContainer = document.getElementById('summary-container');
        
        if (Object.keys(summaries).length === 0) {
            summaryContainer.innerHTML = '<p>No summaries found.</p>';
            return;
        }

        let summaryHTML = '';
        for (const [key, data] of Object.entries(summaries)) {
            summaryHTML += `
                <div class="summary-item">
                    <h3>Video Title aa: ${data.title}</h3>
                    <p>${marked.parse(data.summary)}</p>
                    <button class="delete-btn" data-key="${key}">Delete</button>
                </div>
            `;
        }

        summaryContainer.innerHTML = summaryHTML;

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                deleteSummary(this.getAttribute('data-key'));
            });
        });
    });
}

function deleteSummary(key) {
    chrome.storage.sync.get({ VideoSummary: {} }, function(result) {
        let summaries = result.VideoSummary;
        delete summaries[key];
        chrome.storage.sync.set({ VideoSummary: summaries }, function() {
            console.log('Summary deleted');
            loadSummaries(); // Reload the summaries
        });
    });
}