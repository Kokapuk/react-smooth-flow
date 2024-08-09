import { HTMLProps, ReactElement } from 'react';

export { default } from './SwitchTransition';

export type TransitionState = 'out' | 'in' | 'both' | false;
export type Element = ReactElement<HTMLProps<HTMLElement>> | false | null | undefined;
