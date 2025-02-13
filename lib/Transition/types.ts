export interface Position {
  left: number;
  top: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Rect = Position & Size;

export type MutationTransitionType = 'overlap' | 'sequential';

export type ContentAlign = 'top left' | 'top right' | 'bottom right' | 'bottom left';

export interface TransitionProperties {
  enterKeyframes?: Keyframe[];
  exitKeyframes?: Keyframe[] | 'reversedEnter';
  contentAlign?: ContentAlign;
  avoidMutationTransition?: boolean;
  transitionRootTag?: string;
  mutationTransitionType?: MutationTransitionType;
}

export interface ParsedTransitionProperties extends TransitionProperties {
  contentAlign: ContentAlign;
  mutationTransitionType: MutationTransitionType;
}

export type TransitionMapping<T extends TransitionProperties = TransitionProperties> = Record<string, T>;

export interface TransitionConfig {
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
  image: HTMLDivElement;
  computedStyle: ComputedStyle;
  transitionProperties: ParsedTransitionProperties;
  hasFixedPosition: boolean;
  transitionRoot?: HTMLElement | null;
  targetElement: HTMLElement;
}

export interface TransitionSnapshot {
  transition: Animation;
  onCancel(): void;
}

export type MutableStyleProperty = keyof ComputedStyle;
