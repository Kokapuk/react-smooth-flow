export { default } from './LayoutTransition';

export interface Position {
  left: number;
  top: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Rect = Position & Size;
