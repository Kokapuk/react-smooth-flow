import { HTMLProps, ReactElement } from 'react';

export { default } from './SwitchTransition';

export type TransitionState = 'none' | 'enter' | 'exit';
export type Element = ReactElement<HTMLProps<HTMLElement>> | false;
