import { PropertiesHyphen } from 'csstype';
import { CONSISTENT_SNAPSHOT_PROPERTIES, CONSISTENT_TRANSITION_OPTIONS, STYLE_PROPERTIES_TO_CAPTURE } from './defaults';

export type Tag = string;

export interface Keyframe {
  offset?: number;
  [key: string]: string | number | undefined;
}

export interface PropertyIndexedKeyframes {
  offset?: number[];
  [key: string]: string[] | number[] | undefined;
}

export type Keyframes = Keyframe[] | PropertyIndexedKeyframes;

export type ContentAlign =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerRight'
  | 'bottomRight'
  | 'bottomCenter'
  | 'bottomLeft'
  | 'centerLeft'
  | 'center';

export type PositionAnchor = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

export type RelevantStyleProperties = Exclude<keyof PropertiesHyphen, 'pointer-events'>[];

export interface TransitionOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  ignoreReducedMotion?: boolean;
  enterKeyframes?: Keyframes;
  exitKeyframes?: Keyframes | 'reversedEnter';
  contentEnterKeyframes?: Keyframes;
  contentExitKeyframes?: Keyframes | 'reversedEnter';
  scaleContent?: boolean;
  contentAlign?: ContentAlign;
  positionAnchor?: PositionAnchor;
  forcePresenceTransition?: boolean;
  transitionRootTag?: Tag;
  clip?: boolean;
  relevantStyleProperties?: RelevantStyleProperties;
  persistBounds?: boolean;
  transitionLayout?: boolean;
  disabled?: boolean;
}

export type ParsedTransitionOptions = Required<
  Omit<TransitionOptions, 'exitKeyframes' | 'contentExitKeyframes' | 'transitionRootTag'>
> & {
  exitKeyframes: Keyframes;
  contentExitKeyframes: Keyframes;
  transitionRootTag: Tag | null;
};

export type TransitionMapping<T extends TransitionOptions | ParsedTransitionOptions = TransitionOptions> = Record<
  Tag,
  T
>;

export interface DOMPosition {
  parentElement: HTMLElement;
  index: number;
}

export interface TransitionConfig {
  flushSync?: boolean;
  onBegin?(): void;
  onCancel?(): void;
  onFinish?(): void;
}

export type ComputedStyle = Record<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number], string>;

export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  scrollBarWidth: number;
  scrollBarHeight: number;
}

export interface Snapshot {
  tag: Tag;
  bounds: Bounds;
  image: HTMLDivElement;
  computedStyle: ComputedStyle;
  transitionOptions: ParsedTransitionOptions;
  transitionMapping: TransitionMapping<ParsedTransitionOptions>;
  hasFixedPosition: boolean;
  transitionRoot?: HTMLElement | null;
  targetElement: HTMLElement;
  targetDOMPosition: DOMPosition;
  totalZIndex: number;
}

export type SharedTransitionOptions = Pick<ParsedTransitionOptions, (typeof CONSISTENT_TRANSITION_OPTIONS)[number]>;

export type SnapshotPairSharedData = Required<Pick<Snapshot, (typeof CONSISTENT_SNAPSHOT_PROPERTIES)[number]>> & {
  transitionOptions: SharedTransitionOptions;
};

export interface MutationSnapshotPair {
  prevSnapshot: Snapshot;
  nextSnapshot: Snapshot;
  firstValidSnapshot: Snapshot;
  shared: SnapshotPairSharedData;
  transitionType: 'mutation';
  image: HTMLDivElement;
}

export interface PresenceSnapshotPair {
  prevSnapshot: Snapshot | null;
  nextSnapshot: Snapshot | null;
  firstValidSnapshot: Snapshot;
  shared: SnapshotPairSharedData;
  transitionType: 'presence';
  prevImage: HTMLDivElement | null;
  nextImage: HTMLDivElement | null;
}

export type SnapshotPair = MutationSnapshotPair | PresenceSnapshotPair;

export interface Transition {
  snapshotPair: SnapshotPair;
  animation: Animation;
  cleanup?(): void;
}

export type Falsy = false | 0 | '' | null | undefined;
export type FalsyArray<T> = (T | Falsy)[];

export type StoreRecord = Record<Tag, Transition[]>;
export type Id = string;
export type Store = Record<Id, StoreRecord>;

export interface TransformMatrix {
  scaleX: number;
  skewY: number;
  skewX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}
