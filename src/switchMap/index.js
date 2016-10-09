import './app.sass'
import { Observable } from 'rx'

const button = document.querySelector('#button')

const click$ = Observable.fromEvent(button, 'click')
const interval$ = Observable.interval(500)
const stream$ = click$.switchMap(() => interval$)

stream$.subscribe((x) => log(x))

function log (msg) {
  const logArea = document.querySelector('#log')
  const textNode = document.createTextNode(msg)
  const logRow = document.createElement('div')

  logRow.appendChild(textNode)
  logArea.appendChild(logRow)
  logArea.scrollTop = logArea.scrollHeight
}
