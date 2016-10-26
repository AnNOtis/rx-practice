import './index.sass'
import { Observable } from 'rx'

const unit = 10
const width = 410
const height = 410
const moveRate = 300
const fps = 40

let x = 0
let y = 0
let snakeBody = [
  [0, 1],
  [0, 1],
  [0, 1],
  [0, 1],
  [0, 1],
  [0, 1],
  [0, 1],
  [0, 1],
]

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

const intervalMove$ = Observable.interval(moveRate)
  .withLatestFrom(manualMove$, (_, step) => step)

const nextStep$ = manualMove$
  .merge(intervalMove$)
  .map(mappingCodeToOffset)

const updateScene$ = Observable.interval(fps)
  .skipUntil(start$)

start$.subscribe(drawSnake)
nextStep$.subscribe(walk)
updateScene$.subscribe(drawSnake)

function walk (step) {
  x = x + step[0]
  y = y + step[1]
  snakeBody = [ [-step[0], -step[1]], ...snakeBody.slice(0, -1) ]
}

function drawSnake () {
  let tempX = x * unit
  let tempY = y * unit
  if (tempX > width/2 || tempX < -width/2 || tempY > height/2 || tempY < -height/2 ) {
    alert('lose');
    moveInterval$.depose()
    updateScene$.depose()

    return
  }

  clear()
  rect(ctx, tempX, tempY, unit, unit)

  snakeBody.forEach((value) => {
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
