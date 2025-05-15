import { PropertiesHyphen } from 'csstype';
import {
  CONSISTENT_MUTATION_PAIR_SNAPSHOT_PROPERTIES,
  CONSISTENT_SNAPSHOT_PROPERTIES,
  CONSISTENT_TRANSITION_OPTIONS,
  STYLE_PROPERTIES_TO_CAPTURE,
} from './defaults';
import TransformMatrix from './transformMatrix';

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

export interface CommonTransitionOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  ignoreReducedMotion?: boolean;
  contentAlign?: ContentAlign;
  positionAnchor?: PositionAnchor;
  root?: Tag;
  clip?: boolean;
  relevantStyleProperties?: RelevantStyleProperties;
  transitionLayout?: boolean;
  captureDynamicStates?: boolean;
  captureTransform?: boolean;
  disabled?: boolean;
}

export interface MutationTransitionOptions {
  contentEnterKeyframes?: Keyframes;
  contentExitKeyframes?: Keyframes | 'reversedEnter';
  scaleContent?: boolean;
  contentAlign?: ContentAlign;
  forcePresenceTransition?: boolean;
  persistBounds?: boolean;
}

export interface PresenceTransitionOptions {
  enterKeyframes?: Keyframes;
  exitKeyframes?: Keyframes | 'reversedEnter';
  useLayoutProxyAsRoot?: boolean;
}

export type TransitionOptions = CommonTransitionOptions & MutationTransitionOptions & PresenceTransitionOptions;

export type ResolvedTransitionOptions = Required<
  Omit<TransitionOptions, 'exitKeyframes' | 'contentExitKeyframes' | 'root'>
> & {
  exitKeyframes: Keyframes;
  contentExitKeyframes: Keyframes;
  root: Tag | undefined;
};

export type TransitionMapping<T extends TransitionOptions | ResolvedTransitionOptions> = Record<Tag, T>;

export interface TransitionConfig {
  onBegin?(): void;
  onCancel?(): void;
  onFinish?(): void;
}

export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  transform: TransformMatrix | null;
  scrollBarWidth: number;
  scrollBarHeight: number;
}

export type ComputedStyle = Record<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number], string>;

export interface DOMPosition {
  parentElement: HTMLElement;
  index: number;
}

export interface DynamicState {
  path?: number[];
  scrollTop?: number;
  scrollLeft?: number;
  value?: string;
  checked?: true;
  selectedIndex?: number;
}

export interface Snapshot {
  tag: Tag;
  bounds: Bounds;
  image: HTMLElement;
  computedStyle: ComputedStyle;
  transitionOptions: ResolvedTransitionOptions;
  transitionMapping: TransitionMapping<ResolvedTransitionOptions>;
  hasFixedPosition: boolean;
  root?: HTMLElement | null;
  target: HTMLElement;
  targetClone: HTMLElement;
  targetDOMPosition: DOMPosition;
  totalZIndex: number;
  dynamicStates?: DynamicState[];
}

export type SharedTransitionOptions = Pick<ResolvedTransitionOptions, (typeof CONSISTENT_TRANSITION_OPTIONS)[number]>;

export type SnapshotPairSharedData = Required<Pick<Snapshot, (typeof CONSISTENT_SNAPSHOT_PROPERTIES)[number]>> & {
  transitionOptions: SharedTransitionOptions;
};

export type SnapshotPairMutationSharedData = SnapshotPairSharedData &
  Required<Pick<Snapshot, (typeof CONSISTENT_MUTATION_PAIR_SNAPSHOT_PROPERTIES)[number]>>;

export interface CommonSnapshotPair {
  firstValidSnapshot: Snapshot;
}

export interface MutationSnapshotPair extends CommonSnapshotPair {
  prevSnapshot: Snapshot;
  nextSnapshot: Snapshot;
  transitionType: 'mutation';
  image: HTMLElement;
  shared: SnapshotPairMutationSharedData;
}

export interface PresenceSnapshotPair extends CommonSnapshotPair {
  prevSnapshot: Snapshot | null;
  nextSnapshot: Snapshot | null;
  transitionType: 'presence';
  prevImage: HTMLElement | null;
  nextImage: HTMLElement | null;
  shared: SnapshotPairSharedData;
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
