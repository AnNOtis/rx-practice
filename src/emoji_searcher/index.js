require('./index.sass')
import { Observable } from 'rx'
import $ from 'jquery'
const emojisResponse$ = Observable.fromPromise(
  $.getJSON('https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json')
)

const search$ = Observable.fromEvent($('#input'), 'keyup')
  .map((event) => event.target.value)

const result$ = search$
  .startWith('init search')
  .combineLatest(emojisResponse$, (term, emojis) => {
    if (!term) { return [] }

    return emojis
      .filter((emojiEntity) => {
        try {
          return new RegExp(term).test(emojiEntity.description)
        } catch (e) {
          return false
        }
      })
      .map((emojiEntity) => ({
        name: emojiEntity.aliases,
        emoji: emojiEntity.emoji
      }))
  })

result$.subscribe((resultList) => {
  const $result = $('#result')

  if (resultList.length === 0) {
    $result.text('empty result, please result')
  } else {
    $result.empty()
    resultList.forEach((result) =>
      $result.append(
        $('<li></li>', {
          class: 'emoji',
          text: `${result.emoji} - ${result.name.join()}`
        })
      )
    )
  }
})
