
var emojisResponseStream = Rx.Observable.fromPromise($.getJSON('https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json'))
var searchStream = Rx.Observable.fromEvent($('#input'), 'keyup')
  .map(function (event) { return event.target.value })


resultStream = searchStream
  .startWith('init search')
  .combineLatest(emojisResponseStream, function (term, emojis) {
    if (!term) { return [] }

    return emojis
      .filter(function(emojiEntity) {
        try {
          return new RegExp(term).test(emojiEntity.description)
        } catch (e) {
          return false
        }
      })
      .map(function (emojiEntity) {
        return {
          name: emojiEntity.aliases,
          emoji: emojiEntity.emoji
        }
      })
  })

resultStream.subscribe(function (resultList) {
  var $result = $('#result')

  if (resultList.length === 0) {
    $result.text('empty result, please result')
  } else {
    $result.empty()
    resultList.forEach(function (result) {
      $result.append($('<li></li>', { text: result.emoji + ' - ' + result.name.join() }))
    })
  }
})
