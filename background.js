chrome.action.onClicked.addListener((tab) => {
  // Change the icon to the "open" version
  chrome.action.setIcon({
    path: {
      "16": "icons/icon16_open.png",
      "48": "icons/icon48_open.png",
      "128": "icons/icon128_open.png"
    }
  });

  // Execute the script to copy the current email
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: copyCurrentEmail
    }
  );

  // Revert the icon back after 2 seconds
  setTimeout(() => {
    chrome.action.setIcon({
      path: {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    });
  }, 2000);
});

function copyCurrentEmail() {
  const emailBody = document.querySelector('div[role="main"] .ii.gt');
  if (emailBody) {
    const emailContent = emailBody.innerText;
    const cleanedContent = emailContent.replace(/\s\s+/g, ' ').trim();
    const formattedContent = `### Email Content ###\n${cleanedContent}\n### End of Email Content ###`;

    const textArea = document.createElement('textarea');
    textArea.value = formattedContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    chrome.runtime.sendMessage({ action: 'show-notification', message: 'Content copied to clipboard!' });
  } else {
    chrome.runtime.sendMessage({ action: 'show-notification', message: 'No email found!' });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'show-notification') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Gmail Email Copier',
      message: request.message,
      priority: 2
    });
  }
});
