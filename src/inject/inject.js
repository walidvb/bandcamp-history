chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		addToHistory()
		addMenuItem()
		console.log(getMetadata(document))
		// ----------------------------------------------------------

	}
	}, 10);
});


const ITEM_SELECTOR = '.collection-items .collection-item-container'

function addMenuItem(){
	const lastTabItem = document.querySelector('#grid-tabs li:not(.active)')
	const clone = lastTabItem.cloneNode(true)
	lastTabItem.parentElement.appendChild(clone)
	clone.querySelector('.tab-title').innerText = 'history'
	clone.id = 'bc-history'
	clone.onmousedown = showHistory
}

let contentContainer
function showHistory(){
	document.querySelector('#grid-tabs li.active').classList.remove('active')
	document.querySelector('#grid-tabs li#bc-history').classList.add('active')
	chrome.storage.local.get(['items'], function ({ items } ) {
		console.log(items)
		const tabsWrapper = document.querySelector('#grids')
		const template = document.querySelector('#grids .grid')
		const content = template.cloneNode(true)
		document.querySelector('#grids .grid.active').classList.remove('active')
		content.id = 'bc-history'
		tabsWrapper.appendChild(content)
		contentContainer = content.querySelector('.collection-grid')
		content.querySelector('.expand-container').remove()
		document.querySelector('.owner-controls').style.display = 'none'
		contentContainer.innerHTML = ''
		if(items){
			items.forEach(i => contentContainer.appendChild(generateItem(i)))
		}
	})

	function generateItem({ image, title, artist, url }) {
		const template = document.querySelector(ITEM_SELECTOR)
		const clone = template.cloneNode(true)
		clone.style['min-height'] = 'initial'
		clone.querySelector('img.collection-item-art').src = image
		clone.querySelector('.collection-item-title').innerText = title
		clone.querySelector('.collection-item-artist').innerText = artist
		clone.querySelector('.item-link').href = url
		clone.querySelector('.collection-item-details-container').remove()
		// clone.querySelector('.item_link_play').remove()
		clone.querySelector('.drag-thumb').remove()
		const clicker = clone.querySelector('.track_play_auxiliary')
		clicker.classList.remove('track_play_auxiliary')
		clicker.href = url

		return clone
	}
}

function addToHistory(){
	chrome.storage.local.get(['items'], function ({items: previous = []}) {
		const metadata = getMetadata()
		if(!metadata.artist){
			return
		}
		const compare = ({ url }) => metadata.url === url
		const index = previous.indexOf(previous.find(compare))
		if (index > 0 && index < 20){
			return
		}
		const items = [metadata, ...previous]
		chrome.storage.local.set({ items });
	});
}

function getMetadata(){
	const getValueFor = (property) => document.querySelector(`[property="${property}"]`).attributes.content.value
	const obj = ['og:url', 'og:title', 'og:description', 'og:image'].reduce((prev, curr) => {
		return {
			...prev,
			[curr.replace('og:', '')]: getValueFor(curr)
		}
	}, {})
	const [title, artist] = obj.title.split(', by')
	return { ...obj, title, artist }
}
