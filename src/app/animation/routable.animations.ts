import {
  trigger,
  transition,
  query,
  style,
  group,
  animate,
  stagger,
  animation
} from '@angular/animations';

export const routerTransitionSlide = trigger('routerTransitionSlide', [
  transition('* => *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        right: 0,
        transform: 'translateX(0)'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        style({ transform: 'translateX(0)' }),
        animate(
          '1000ms ease-out',
          style({
            transform: 'translateX(100%)'
          })
        )
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(
          '1000ms ease-in',
          style({
            transform: 'translateX(0)'
          })
        )
      ], { optional: true })
    ])
  ]),
]);
