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

const renderItem = ({ }) => `
<li id="collection-item-container_52356390" class="collection-item-container track_play_hilite  initial-batch" data-trackid="34386692" data-itemid="52356390" data-itemtype="album" data-tralbumid="52356390" data-tralbumtype="a" data-bandid="3973788830" data-title="It Was '4 Now' 4 A Reason" data-ispurchasable="true" data-index="" data-giftid="" data-token="1617196323:52356390:a::" data-tracknum="0" data-firsttrack="0" style="position: relative; opacity: 1; left: 0px; top: 0px;">















    <div class="drag-thumb"><span class="bkgd"></span><span class="bc-ui"></span></div>


<div class="a52356390 collection-item-gallery-container ">
    <span class="bc-ui2 collect-item-icon-alt"></span>



    <div class="collection-item-art-container">
        <a class="track_play_auxiliary" data-trackid="34386692">


            <img class="collection-item-art" alt="" src="https://f4.bcbits.com/img/a3334236481_16.jpg">




                <span class="item_link_play" tabindex="0">
                    <span class="item_link_play_bkgd round4"></span>
                    <span class="item_link_play_widget bc-ui"></span>
                </span>


        </a>

    </div>

    <div class="collection-title-details">


                <a target="_blank" href="https://goteki-45.bandcamp.com/album/it-was-4-now-4-a-reason-2" class="item-link">
                    <div class="collection-item-title">It Was '4 Now' 4 A Reason
                        <span class="collection-item-gift-given-title hidden">(gift given)</span>
                    </div>
                    <div class="collection-item-artist">by Goteki 45</div>
                </a>






    </div>

</div>

<div class="collection-item-details-container">

    <span class="item-link-alt">
        <div class="collection-item-title">It Was '4 Now' 4 A Reason</div>
        <div class="collection-item-artist">by Goteki 45</div>
    </span>


    <span id="favtrack-why-wrapper-item_52356390">


    <div class="knockout-container">
<div class="collection-item-fav-track can-choose-track ">



            <label for="favtrack" class="favoriteTrackLabel">
                favorite track

                    <span class="edit-item-link" tabindex="0">– <a>

                        set

                    </a></span>

            </label>





</div>



        <div class="collection-item-why">
            <div class="question-link" tabindex="0">
                <a>

                    Why do you love this album?

                </a>
            </div>
        </div>




</div>


    </span>





    <div class="collection-item-actions  signup-tooltip-parent" data-tooltip-id="x">

            <ul>

        <li class="hear-more-alt"><a href="" target="_blank"> view album</a></li>





</ul>

    </div>







    <div class="collected-by">
        <div class="collected-by-header">


                    appears in
                    <a class="item-link also-link">
                        6 other collections</a>
        </div>
        <div class="deets" style="display:none">
            <div class="loading initial-loading"></div>
        </div>
    </div>

    <div class="bottom-owner-controls">
        <span class="edit-item-mobile">
            <a class="edit-button">edit</a>
        </span>
        <span class="redownload-item">
            <a href="https://bandcamp.com/download?from=collection&amp;payment_id=170066269&amp;sig=bc0c5fb73e1151b4468e2282f34e395d&amp;sitem_id=152952512">download</a>
        </span>
        <span class="hide-item">
            <a>hide album</a>
        </span>
    </div>
</div>
</li>
`

function addMenuItem(){
	const lastTabItem = document.querySelector('#grid-tabs li:last-child')
	const clone = lastTabItem.cloneNode(true)
	lastTabItem.parentElement.appendChild(clone)
	clone.querySelector('.tab-title').innerText = 'history'
}

function addToHistory(){
	chrome.storage.sync.get(['items'], function ({items: previous} = { items: [] }) {
		// prevent duplicates
		const items = [...previous, getMetadata()]
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
