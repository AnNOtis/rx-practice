import './index.sass'
import { Observable } from 'rx'
import PaintCanvas from './paint_canvas'

const unit = 10
const width = unit * 41
const height = unit * 41
const moveRate = 500
const fps = 40

const BG = {
  menu: '#345',
  gaming: '#333'
}

let INIT_SNAKE =
  {
    head: [0, 0],
    body: [
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
    ],
  }

const keyup$ = Observable.fromEvent(document, 'keyup')
  .pluck('code')

const start$ = keyup$
  .filter((value) => value === 'Space')

const pressArrowKey$ = keyup$
  .filter(isValidArrowKeyCode)

const manualMove$ = pressArrowKey$
  .skipUntil(start$)
  .distinctUntilChanged(null, isReversedArrowKey)

const intervalMove$ = Observable.interval(moveRate)
  .withLatestFrom(manualMove$, (_, step) => step)

const nextStep$ = manualMove$
  .merge(intervalMove$)
  .map(mappingCodeToOffset)

const snakeMoved$ = nextStep$
  .scan((snake, step) => {
    const { head, body } = snake

    return {
      head: [ head[0]+step[0], head[1]+step[1] ],
      body: [ [-step[0], -step[1]], ...body.slice(0, -1) ]
    }
  }, INIT_SNAKE)
  .startWith(INIT_SNAKE)

const updateScene$ = Observable.interval(fps)
  .skipUntil(start$)
  .withLatestFrom(snakeMoved$, (_, snake) => snake)

const pc = prepareCanvas()
drawMenu()

start$.subscribe(resetScene)
updateScene$.subscribe(drawSnake)

function prepareCanvas () {
  return new PaintCanvas(document.getElementById('game'), { width, height })
}

function drawMenu() {
  pc.clear(BG.menu)
}

function resetScene() {
  pc.clear(BG.gaming)
}

function drawSnake (snake) {
  resetScene()

  const { head, body } = snake

  ;[[0, 0], ...body].reduce((acc, current) => {
    const position = [
      acc[0] + current[0],
      acc[1] + current[1]
    ]
    drawSnakeJoint(position[0], position[1])
    return position
  }, head)
}

function drawSnakeJoint(x, y) {
  pc.strokeStyle('green')
  pc.rect(x * unit, y * unit, unit, unit)
}

function mappingCodeToOffset (code) {
  const mapping = {
    'ArrowUp': [0, -1],
    'ArrowDown': [0, 1],
    'ArrowLeft': [-1, 0],
    'ArrowRight': [1, 0],
  }

  return mapping[code]
}

function isValidArrowKeyCode (code) {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(code) !== -1
}

function isReversedArrowKey (keyOne, KeyTwo) {
  const reversedKeyMapping = {
    ArrowUp: 'ArrowDown',
    ArrowDown: 'ArrowUp',
    ArrowLeft: 'ArrowRight',
    ArrowRight: 'ArrowLeft',
  }

  return reversedKeyMapping[keyOne] === KeyTwo
}
