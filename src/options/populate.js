document.onreadystatechange = () => {
  if(document.readyState === 'complete'){
    document.querySelector('#syncer').onclick = runSync
  }
}


function runSync({ target }){
  target.classList.add('loading')
  chrome.history.search({ text: 'bandcamp.com', maxResults: 1000 }, function (data) {
    console.table(data)
    const items = data.map(function (page) {
      const [title, artist] = page.title.split(' | ')
      const a = document.createElement('a')
      a.href = page.url
      console.log(a.pathname)
      if (!/^\/(album|track)/.test(a.pathname)) {
        return
      }
      return {
        ...page,
        artist,
        title,
        image: `https://picsum.photos/210?id=${Math.ceil(Math.random()*2000)}`
      }
    }).filter(Boolean);
    console.table(items.filter(Boolean))
    chrome.storage.local.set({ items, hasImported: true }, () => {
      document.body.classList.add('success')
      document.querySelector('#number').textContent = items.length
    });
  });
}