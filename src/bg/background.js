chrome.commands.onCommand.addListener((shortcut) => {
  if (shortcut.includes("+J")) {
    chrome.runtime.reload();
  }
})

chrome.runtime.onMessage.addListener(function (message) {
  switch (message.action) {
    case "openOptionsPage":
      chrome.runtime.openOptionsPage();
      break;
    default:
      break;
  }
});
