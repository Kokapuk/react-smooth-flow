import { Rect } from '../types';

export interface ViewTransitionProperties {
  tag: string;
  enterKeyframes?: Keyframe[];
  exitKeyframes?: Keyframe[] | 'reversedEnter';
  contentAlign?: 'top left' | 'top right' | 'bottom right' | 'bottom left';
  avoidMutationTransition?: boolean;
  viewTransitionRootTag?: string;
}

export interface ViewTransitionConfig {
  duration: number;
  easing?: string;
  suppressHidingTags?: string[];
  forceFixedPosition?: boolean;
}

export type ComputedStyle = Omit<CSSStyleDeclaration, 'item' | 'getPropertyPriority' | 'getPropertyValue'>;

export interface Snapshot {
  rect: Rect;
  image: SVGSVGElement;
  computedStyle: ComputedStyle;
  viewTransitionProperties: ViewTransitionProperties;
  hasFixedPosition: boolean;
  viewTransitionRoot?: HTMLElement | null;
}

export interface TransitionSnapshot {
  transition: Animation;
  onCancel(): void;
}
