// Saves options to chrome.storage
function saveOptions() {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set(
        { openaiApiKey: apiKey },
        function() {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
            displayMaskedKey(apiKey);
        }
    );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get(
        { openaiApiKey: '' },
        function(items) {
            document.getElementById('apiKey').value = items.openaiApiKey;
            displayMaskedKey(items.openaiApiKey);
        }
    );
}

// Toggle visibility of API key
function toggleVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleButton = document.getElementById('toggleVisibility');

    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleButton.textContent = 'Hide';
    } else {
        apiKeyInput.type = 'password';
        toggleButton.textContent = 'Show';
    }
}

// Display masked version of the API key
function displayMaskedKey(apiKey) {
    const maskedKeyDiv = document.getElementById('maskedKey');
    if (apiKey) {
        const maskedKey = '*'.repeat(apiKey.length);
        maskedKeyDiv.textContent = maskedKey;
        maskedKeyDiv.style.display = 'block';
    } else {
        maskedKeyDiv.textContent = '';
        maskedKeyDiv.style.display = 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('toggleVisibility').addEventListener('click', toggleVisibility);
 document.getElementById('apiKey').addEventListener('input', function() {
    displayMaskedKey(this.value);
});