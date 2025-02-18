export interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type MutationTransitionType = 'overlap' | 'sequential';

export type ContentAlign =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'bottomCenter'
  | 'centerLeft'
  | 'centerRight'
  | 'center';

export type ImageOverflow = 'hidden' | 'visible';

export type Keyframes =
  | {
      offset?: number;
      [key: string]: string | number | undefined;
    }[]
  | {
      offset?: number[];
      [key: string]: string[] | number[] | undefined;
    };

export interface TransitionProperties {
  enterKeyframes?: Keyframes;
  exitKeyframes?: Keyframes | 'reversedEnter';
  contentAlign?: ContentAlign;
  avoidMutationTransition?: boolean;
  transitionRootTag?: string;
  mutationTransitionType?: MutationTransitionType;
  overflow?: ImageOverflow;
}

export interface ParsedTransitionProperties extends TransitionProperties {
  enterKeyframes: Keyframes;
  exitKeyframes: Keyframes;
  contentAlign: ContentAlign;
  mutationTransitionType: MutationTransitionType;
  overflow: ImageOverflow;
}

export type TransitionMapping<T extends TransitionProperties = TransitionProperties> = Record<string, T>;

export interface TransitionConfig {
  duration: number;
  easing?: string;
  noFlushSync?: boolean;
  ignoreReducedMotion?: boolean;
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
  boundingBox: BoundingBox;
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
