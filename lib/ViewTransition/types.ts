export interface Position {
  left: number;
  top: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Rect = Position & Size;

export type MutationTransitionFadeType = 'overlap' | 'sequential';

export type ContentAlign = 'top left' | 'top right' | 'bottom right' | 'bottom left';

export interface ViewTransitionProperties {
  enterKeyframes?: Keyframe[];
  exitKeyframes?: Keyframe[] | 'reversedEnter';
  contentAlign?: ContentAlign;
  avoidMutationTransition?: boolean;
  viewTransitionRootTag?: string;
  mutationTransitionFadeType?: MutationTransitionFadeType;
}

export interface ParsedViewTransitionProperties
  extends Omit<ViewTransitionProperties, 'contentAlign' | 'mutationTransitionFadeType'> {
  contentAlign: ContentAlign;
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

export type ComputedStyle = Omit<
  CSSStyleDeclaration,
  | 'item'
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'removeProperty'
  | 'setProperty'
  | 'cssProperty'
  | 'cssText'
  | 'length'
  | 'parentRule'
  | number
  | typeof Symbol.iterator
>;

export interface Snapshot {
  tag: string;
  rect: Rect;
  image: SVGSVGElement;
  computedStyle: ComputedStyle;
  viewTransitionProperties: ParsedViewTransitionProperties;
  hasFixedPosition: boolean;
  viewTransitionRoot?: HTMLElement | null;
  targetElement: HTMLElement;
}

export interface TransitionSnapshot {
  transition: Animation;
  onCancel(): void;
}

export type MutableStyleProperty = keyof ComputedStyle;
