
chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		
		addToHistory()
		addMenuItem()

	}
	}, 10);
});

// this file needs to be broken up

const ITEM_SELECTOR = '.collection-items .collection-item-container'

const isOwnerPage = () => Boolean(document.querySelector('.fan-bio.owner'))
function addMenuItem(){
	if (!isOwnerPage()){
		return
	}
	const lastTabItem = document.querySelector('#grid-tabs li:not(.active)')
	const clone = lastTabItem.cloneNode(true)
	lastTabItem.parentElement.appendChild(clone)
	clone.querySelector('.tab-title').innerText = 'history'
	clone.id = 'bc-history'
	clone.attributes['data-grid-id'].value = 'bc-history-grid'
	clone.attributes['data-tab'].value = 'bc-history'
	clone.onmouseup = showHistory
}

let contentContainer
function showHistory(){
	document.querySelector('#grid-tabs li.active').classList.remove('active')
	document.querySelector('#grid-tabs li#bc-history').classList.add('active')
	chrome.storage.local.get(['items'], function ({ items } ) {
		// TODO: fix navigating multiple times
		const tabsWrapper = document.querySelector('#grids')
		const template = document.querySelector('#grids .grid')
		const content = template.cloneNode(true)
		document.querySelector('#grids .grid.active').classList.remove('active')
		content.id = 'bc-history'
		content.classList.add('active')
		tabsWrapper.appendChild(content)
		contentContainer = content.querySelector('.collection-grid')
		content.querySelector('.expand-container').remove()
		document.querySelector('.owner-controls').style.display = 'none'
		contentContainer.innerHTML = ''
		if(items){
			items.forEach(i => contentContainer.appendChild(generateItem(i)))
		}
		contentContainer.insertAdjacentElement('beforeEnd', linkToOptions())
	})

	function linkToOptions(){
		const a = document.createElement('button')
		a.onmousedown = () => {
			console.log('tes')
			chrome.runtime.sendMessage({ action: "openOptionsPage" });
		}
		a.innerText = "sync my history"
		a.className = "show-more"
		const div = document.createElement('div')
		div.className = 'expand-container show-button'
		div.append(a)
		return div
	}
	function generateItem({ image, title, artist, url }) {
		const template = document.querySelector(ITEM_SELECTOR)
		const clone = template.cloneNode(true)
		clone.style['min-height'] = 'initial'
		clone.querySelector('img.collection-item-art').src = image
		clone.querySelector('.collection-item-title').innerText = title
		clone.querySelector('.collection-item-artist').innerText = artist
		clone.querySelector('.item-link').href = url
		clone.querySelector('.collection-item-details-container')?.remove()
		// clone.querySelector('.item_link_play').remove()
		clone.querySelector('.drag-thumb')?.remove()
		const clicker = clone.querySelector('.track_play_auxiliary')
		clicker.classList.remove('track_play_auxiliary')
		clicker.href = url

		return clone
	}
}

function addToHistory(){
		const isBandcamp = getValueFor('twitter:site') === '@bandcamp'
		if (!isBandcamp) return
		chrome.storage.local.get(['items'], function ({items: previous = []}) {
			const metadata = getMetadata()
			if(!metadata){
				return
			}
			const compare = ({ url }) => metadata.url === url
			// only add if not in last 20
			const index = previous.indexOf(previous.find(compare))
			if (index > 0 && index < 20){
				return
			}
			const items = [metadata, ...previous]
			chrome.storage.local.set({ items });
		});
}

const getValueFor = (property) => document.querySelector(`[property="${property}"]`)?.attributes?.content?.value?.trim?.()
function getMetadata(){
	const obj = ['og:url', 'og:title', 'og:description', 'og:image'].reduce((prev, curr) => {
		return {
			...prev,
			[curr.replace('og:', '')]: getValueFor(curr)
		}
	}, {})
	const [title, artist] = obj.title.split(', by')
	const lastVisitTime = new Date()
	return { ...obj, title, artist, lastVisitTime }
}
