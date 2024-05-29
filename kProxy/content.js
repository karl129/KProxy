// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggleProxy === true) {
    // Handle the message. In this case, we're not doing anything specific.
    console.log("Toggle proxy message received by content script.");
  }
});
