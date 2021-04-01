chrome.commands.onCommand.addListener((shortcut) => {
  if (shortcut.includes("+J")) {
    chrome.runtime.reload();
  }
})
