import { Rect } from '../types';

export interface ViewTransitionProperties {
  tag: string;
  enterKeyframes?: Keyframe[];
  exitKeyframes?: Keyframe[];
}

export interface ViewTransitionConfig {
  duration: number;
  easing?: string;
  suppressHidingOnEnter?: boolean;
}

export type ComputedStyle = Omit<CSSStyleDeclaration, 'item' | 'getPropertyPriority' | 'getPropertyValue'>;

export interface Snapshot {
  rect: Rect;
  image: SVGSVGElement;
  computedStyle: ComputedStyle;
  viewTransitionProperties: ViewTransitionProperties;
}

export interface TransitionSnapshot {
  transition: Animation;
  prevSnapshotImage?: SVGSVGElement;
  nextSnapshotImage?: SVGSVGElement;
  targetElement?: HTMLElement;
  targetResetVisibility?: string;
}
