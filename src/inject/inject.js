chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		run()
		addToHistory()
		console.log(getMetadata(document))
		// ----------------------------------------------------------

	}
	}, 10);
	function run(){
	}
});

function addToHistory(){
	chrome.storage.sync.get(['items'], function ({items: previous} = { items: [] }) {
		console.log('got', previous)
		const items = [...previous, getMetadata()]
		console.log(previous, items, "items")
		chrome.storage.sync.set({ items });
	});
}

function getMetadata(){
	const getValueFor = (property) => document.querySelector(`[property="${property}"]`).attributes.content.value
	return ['og:url', 'og:title', 'og:description', 'og:image'].reduce((prev, curr) => {
		return {
			...prev,
			[curr.replace('og:', '')]: getValueFor(curr)
		}
	}, {})
}
