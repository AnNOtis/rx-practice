import './index.sass'
import { Observable } from 'rx'

const unit = 10
const width = 410
const height = 410
const moveRate = 500
const fps = 40

let x = 0
let y = 0
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

const canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = width
canvas.height = height
document.body.appendChild(canvas)

const ctx = canvas.getContext('2d')
ctx.translate(width/2, height/2)

const keyup$ = Observable.fromEvent(document, 'keyup')
  .pluck('code')

const start$ = keyup$
  .filter((value) => value === 'Space')

const pressArrowKey$ = keyup$
  .filter((value) =>
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(value) !== -1
  )

const manualMove$ = pressArrowKey$
  .skipUntil(start$)
  .distinctUntilChanged(null, (preKey, currentKey) => {
    const youCanNotGoBack = {
      ArrowUp: 'ArrowDown',
      ArrowDown: 'ArrowUp',
      ArrowLeft: 'ArrowRight',
      ArrowRight: 'ArrowLeft',
    }

    return youCanNotGoBack[preKey] === currentKey
  })

const intervalMove$ = Observable.interval(moveRate)
  .withLatestFrom(manualMove$, (_, step) => step)

const nextStep$ = manualMove$
  .merge(intervalMove$)
  .map(mappingCodeToOffset)

const snakeMoved$ = nextStep$
  .scan((snake, step) => {
    const {
      head,
      body,
    } = snake

    if (step[0] == -head[0] && step[1] == -head[1]) {
      return snake
    }

    return {
      head: [head[0] + step[0], head[1] + step[1]],
      body: [ [-step[0], -step[1]], ...body.slice(0, -1) ]
    }
  }, INIT_SNAKE)
  .startWith(INIT_SNAKE)

const updateScene$ = Observable.interval(fps)
  .skipUntil(start$)
  .withLatestFrom(snakeMoved$, (_, snake) => snake)

start$.subscribe(clear)
updateScene$.subscribe(drawSnake)

function drawSnake (snake) {
  const {
    head,
    body,
  } = snake

  let tempX = head[0] * unit
  let tempY = head[1] * unit
  if (tempX > width/2 || tempX < -width/2 || tempY > height/2 || tempY < -height/2 ) {
    alert('lose');
    moveInterval$.depose()
    updateScene$.depose()

    return
  }

  clear()
  rect(ctx, tempX, tempY, unit, unit)

  body.forEach((value) => {
    tempX = tempX + value[0] * unit
    tempY = tempY + value[1] * unit

    rect(ctx, tempX, tempY, unit, unit)
  })
}

function clear () {
  ctx.fillStyle = 'black'
  ctx.fillRect(0 - width / 2, 0 - height / 2, width, height)
}

function rect(ctx, x, y, width, height) {
  ctx.strokeStyle = 'green'
  ctx.strokeRect(x - width/2, y - height/2, width, height)
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
