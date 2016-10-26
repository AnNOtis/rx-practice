import { Observable } from 'rx'

const source$ = Observable.from(['a', 'b', 'c'])
  .flatMapLatest((x) => Observable.from([x + 1, x + 2]))

source$.subscribe((log) => console.log(log))

// const source$ = Observable.from([100, 300, 200])
//   .flatMap((x) => Observable.timer(x).map(() => x))
//   .flatMapLatest((x) => Observable.timer(200).map(() => x))
//
// source$.subscribe((log) => console.log(log))

//
// const source = Rx.Observable
//   .range(1, 3)
//   .flatMapLatest(function(x) {
//     return Rx.Observable.from([x + 'a', x + 'b']);
//   });
//
// source.subscribe(
//   (x) => console.log('Next: %s', x),
//   (err) => console.log('Error: %s', err),
//   () => console.log('Completed')
// )
