var changelog = document.getElementById('changelog');
var message = document.getElementById('message');
var source = document.getElementById('source');
var showChangelogButton = document.getElementById('showChangelogButton');

var extensionId = window.location.hash.substr(1);
var webstoreUrl = 'https://chrome.google.com/webstore/detail/'+ extensionId;

// Show captured changelog from the Chrome Web Store.
function showChangelog() {
  // Show/hide DOM Elements.
  showChangelogButton.style.display = 'none';
  message.style.display = 'none';
  changelog.style.display = 'block';
  source.href = webstoreUrl;
  source.textContent = webstoreUrl;

  getWebstoreChangelog(extensionId, function success(changelogText) {
    changelog.innerHTML = changelogText;
  }, function error() {
    changelog.style.display = 'none';
    message.style.display = 'block';
    message.classList.add('sorry');
    message.textContent = chrome.i18n.getMessage('sorryMessageText');
  });
}

var permissions = { origins: ['https://chrome.google.com/*'] };

// Request permissions when user clicks on Request button.
showChangelogButton.addEventListener('click', function() {
  chrome.permissions.request(permissions, function(hasGranted) {
    if (hasGranted)
      showChangelog();
  });
});

window.onload = function() {
  localize();

  chrome.management.get(extensionId, function(extension) {
    var title = chrome.i18n.getMessage('titleChangelogText', [extension.name]);
    document.getElementById('title').textContent = title;
    document.title = title;
  });

  // Show changelog if user already granted permissions.
  chrome.permissions.contains(permissions, function(result) {
    if (result)
      showChangelog();
  });
}
