import { trigger, style, animate, transition} from '@angular/animations';
export const OPEN_CLOSE_ANIMATION = [
trigger('moveState', [
    transition(':enter', [
      style({ transform: 'translateY(150%)', opacity: 0 }),
      animate('2000ms', style({ transform: 'translateY(0%)', opacity: 1 }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0%)', opacity: 1 }),
      animate('2000ms ease-out', style({ transform: 'translateY(100%)', opacity: 0 }))
    ]),
]),
trigger('enterAnimation', [
      transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('1500ms', style({ transform: 'translateX(0)', opacity: 1 }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0)', opacity: 1 }),
      animate('1500ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
    ]),
  ]),
];

