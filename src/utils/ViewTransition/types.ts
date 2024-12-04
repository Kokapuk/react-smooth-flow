import { Rect } from '../types';

export type MutationTransitionFadeType = 'overlap' | 'sequential';

export interface ViewTransitionProperties {
  enterKeyframes?: Keyframe[];
  exitKeyframes?: Keyframe[] | 'reversedEnter';
  contentAlign?: 'top left' | 'top right' | 'bottom right' | 'bottom left';
  avoidMutationTransition?: boolean;
  viewTransitionRootTag?: string;
  mutationTransitionFadeType?: MutationTransitionFadeType;
}

export interface ParsedViewTransitionProperties extends Omit<ViewTransitionProperties, 'mutationTransitionFadeType'> {
  mutationTransitionFadeType: MutationTransitionFadeType;
}

export type ViewTransitionMapping<T extends ViewTransitionProperties = ViewTransitionProperties> = Record<string, T>;

export interface ViewTransitionConfig {
  duration: number;
  easing?: string;
  noFlushSync?: boolean;
  onBegin?(): void;
  onCancel?(): void;
  onFinish?(): void;
}

export type ComputedStyle = Omit<CSSStyleDeclaration, 'item' | 'getPropertyPriority' | 'getPropertyValue'>;

export interface Snapshot {
  tag: string;
  rect: Rect;
  image: SVGSVGElement;
  computedStyle: ComputedStyle;
  viewTransitionProperties: ParsedViewTransitionProperties;
  hasFixedPosition: boolean;
  viewTransitionRoot?: HTMLElement | null;
}

export interface TransitionSnapshot {
  transition: Animation;
  onCancel(): void;
}
