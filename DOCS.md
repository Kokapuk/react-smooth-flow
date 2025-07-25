# Concept

Idea behind React Smooth Flow is very similar to [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API). Elements that will be animated using the library should have unique identifier called `Tag`. Transitions perform by updating DOM in some way and capturing snapshots of targets before and after the update. Let's call snapshot captured before the updated `prev` and snapshot captured after the update `next`. When performing transition via `startTransition` snapshot pairs get created. Each pair contain at least one snapshot: `prev` and/or `next`. Pair also determines transition type, there are two: `mutation` and `presence` (enter/exit). Transition type of a pair depends on whether both snapshots were captured. For example, if we could capture both snapshots, that means that we have to perform `mutation` transition. If we were able to only capture `prev` snapshot, that means that we have to perform `presence` (exit in this case) transition. DOM updates instantly, and visible transition performs on copies of original elements that were recreated by captured snapshots.

## How is works?

```mermaid
graph
    A[Capture snapshots]-->B[Update DOM]
    B-->C[Capture snapshots]
    C-->D[Form snapshot pairs]
    D-->E[Perform transitions for pairs]
```

# API Reference

## Binder

`Binder` is used to specify transitions and root.

### Type declaration

```ts
declare const Binder: ({
  children,
  transitionMapping,
  root,
  refPropName = 'ref',
}: Props) => React.ReactElement<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
  string | React.JSXElementConstructor<any>
>;

interface Props {
  children: ReactElement<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>;
  transitions?: TransitionMapping<TransitionOptions>;
  root?: Tag;
  refPropName?: string;
}

type TransitionMapping = Record<Tag, TransitionOptions>;

type Tag = string;

interface CommonTransitionOptions {
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
  captureDynamicStatesDepth?: number;
  captureTransform?: boolean;
  disabled?: boolean;
}

interface MutationTransitionOptions {
  contentEnterKeyframes?: Keyframes;
  contentExitKeyframes?: Keyframes | 'reversedEnter';
  scaleContent?: boolean;
  contentAlign?: ContentAlign;
  forcePresenceTransition?: boolean;
  persistBounds?: boolean;
}

interface PresenceTransitionOptions {
  enterKeyframes?: Keyframes;
  exitKeyframes?: Keyframes | 'reversedEnter';
  useLayoutProxyAsRoot?: boolean;
}

type TransitionOptions = CommonTransitionOptions & MutationTransitionOptions & PresenceTransitionOptions;

type Keyframes = Keyframe[] | PropertyIndexedKeyframes;

interface Keyframe {
  offset?: number;
  [key: string]: string | number | undefined;
}

interface PropertyIndexedKeyframes {
  offset?: number[];
  [key: string]: string[] | number[] | undefined;
}

type ContentAlign =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerRight'
  | 'bottomRight'
  | 'bottomCenter'
  | 'bottomLeft'
  | 'centerLeft'
  | 'center';

type PositionAnchor = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

type RelevantStyleProperties = Exclude<keyof CSS.PropertiesHyphen, 'pointer-events'>[];
```

### Usage

```tsx
<Binder
  transitions={{
    tagA: {
      duration: 400,
      enterKeyframes: {
        transform: ['translateX(-250px)', 'translateX(0)'],
        opacity: [0, 1],
      },
      exitKeyframes: [
        {
          transform: 'translateX(0)',
          opacity: 1,
        },
        {
          transform: 'translateX(250px)',
          opacity: 0,
        },
      ],
    },

    tagB: {
      duration: 1200,
      enterKeyframes: { transform: ['scale(0)', 'scale(1)'] },
      exitKeyframes: 'reversedEnter',
    },
  }}
  root="rootTagA"
>
  <div />
</Binder>
```

> [!WARNING]
> If you're using a custom component, make sure it properly forwards the ref to an underlying HTML element — otherwise, `Binder` won't be able to apply transitions or register the node correctly

### `TransitionOptions` options

#### `duration`

Default: `300`

Transition duration in ms.

#### `easing`

Default: `'ease'`

Transition easing function. [<easing-function\>](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)

> [!TIP]
> [Create complex animation curves in CSS with the linear() easing function](https://developer.chrome.com/docs/css-ui/css-linear-easing-function). Try [Easing Wizard](https://easingwizard.com)

#### `delay`

Default: `0`

Transition start delay in ms.

#### `ignoreReducedMotion`

Default: `false`

Whether a transition should be played regardless of [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

#### `enterKeyframes`

Default: `{ opacity: [0, 1] }`

DOM enter animation keyframes. [Keyframe Formats](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)

#### `exitKeyframes`

Default: `{ opacity: [1, 0] }`

DOM exit animation keyframes. [Keyframe Formats](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)

#### `contentEnterKeyframes`

Default: `{ opacity: [0, 1, 1] }`

Mutation transition new content enter animation keyframes. [Keyframe Formats](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)

#### `contentExitKeyframes`

Default: `{ opacity: [1, 1, 0] }`

Mutation transition old content exit animation keyframes. [Keyframe Formats](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)

#### `scaleContent`

Default: `false`

Wether snapshot content should scale on mutation transition.

#### `contentAlign`

Default: `'topLeft'`

Snapshot content alignment.

#### `positionAnchor`

Default: `'topLeft'`

Snapshot position anchor.

#### `forcePresenceTransition`

Default: `false`

Whether `presence` transition should be played instead of `mutation`.

#### `root`

Default: `null`

Determines custom transition root by tag instead of screen-wide overlay root.

#### `clip`

Default: `true`

Whether to clip snapshot content on overflow.

#### `relevantStyleProperties`

Default: `[]`

Additional style properties to capture and apply to snapshot content. If you have relevant css selectors for element styling, those styles will not apply for transitioned "shell", if element is not transitioned in it's original root

> [!NOTE]
> By default capturing necessary styles only for performance reasons

#### `persistBounds`

Default: `true`

Determines whether to capture bounds of pre-DOM update snapshot from active mutation transition snapshot, if possible. (Mutation transition only)

#### `transitionLayout`

Default: `false`

Determines whether to animate layout

#### `captureDynamicStatesDepth`

Default: `0`

Determines depth of capturing dynamic states. 

- `0` no capturing
- `1` capture target element only
- `2+` capture target and descendants at a given depth
- `-1` for infinite depth (may hurt performance when used on elements with many children)

States that will get captured for target element and all descendants at a given depth:

- scroll position
- input and textarea `value`
- checkbox and radio inputs `checked`
- select `selectedIndex`

> [!NOTE]
> Disabled by default for performance reasons

#### `captureTransform`

Default: `false`

Determines whether to capture transform for bounds.

> [!NOTE]
> Disabled by default for performance reasons

#### `disabled`

Default: `false`

Whether snapshot should not be captured.

## Root

`Binder` is used to specify custom transition root. By default all transitions perform on screen-wide overlay root to make sure cross-container transitions look valid even with `overflow` property set to something other than `visible` on parent containers. But in some cases you may want to intentionally restrict visibility of an element while transitioning. Or you may want your transitioning element to tolerate complex-moving element, like with `position: sticky` or `translate` animation running on it

### Usage

```html
<Binder root="rootTagA">
  <div style={{ overflow: 'hidden' }}>
    <Binder transitions={{ tagA: { root: 'rootTagA' } }}>
      <div />
    </Binder>
  </div>
</Binder>

```

## startTransition

`startTransition` is used to update DOM and perform transitions for elements by specified tags.

### Type declaration

```ts
declare const startTransition: (
  tags: FalsyArray<Tag>,
  updateDOM?: () => void | Promise<void>,
  config?: TransitionConfig
) => Promise<void>;

type FalsyArray<T> = (T | Falsy)[];

type Falsy = false | 0 | '' | null | undefined;

interface TransitionConfig {
  onBegin?(): void;
  onCancel?(): void;
  onFinish?(): void;
}
```

### Usage

```ts
startTransition(['tagA', 'tagB'], () => setState(newStateValue));
```

> [!IMPORTANT]
> Order of the provided tags represents the order of corresponding snapshots in the DOM. It may be crucial in some cases, when transitioning elements intersect with each other and you want them to be ordered correctly.

### `TransitionConfig` options

#### `onBegin`

Default: `undefined`

Fires before transitions begin.

#### `onCancel`

Default: `undefined`

Fires at first transition interruption.

#### `onFinish`

Default: `undefined`

Fires if all transitions finished successfully.

## cancelTransition

`cancelTransition` is used to cancel transitions by specified tags.

### Type declaration

```ts
declare const cancelTransition: (...tags: FalsyArray<Tag>) => void;

type FalsyArray<T> = (T | Falsy)[];

type Falsy = false | 0 | '' | null | undefined;

type Tag = string;
```

### Usage

```ts
cancelTransition('tagA', 'tagB');
```

## `defaults`

`defaults` is used to configure default library options.

### Type declaration

```ts
declare const defaults: ConfigurableDefaults;

interface ConfigurableDefaults {
  transitionOptions: ResolvedTransitionOptions;
}

type ResolvedTransitionOptions = Required<
  Omit<TransitionOptions, 'exitKeyframes' | 'contentExitKeyframes' | 'root'>
> & {
  exitKeyframes: Keyframes;
  contentExitKeyframes: Keyframes;
  root: Tag | undefined;
};

type Keyframes = Keyframe[] | PropertyIndexedKeyframes;

interface Keyframe {
  offset?: number;
  [key: string]: string | number | undefined;
}

interface PropertyIndexedKeyframes {
  offset?: number[];
  [key: string]: string[] | number[] | undefined;
}

type Tag = string;

interface CommonTransitionOptions {
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
  captureDynamicStatesDepth?: number;
  captureTransform?: boolean;
  disabled?: boolean;
}

interface MutationTransitionOptions {
  contentEnterKeyframes?: Keyframes;
  contentExitKeyframes?: Keyframes | 'reversedEnter';
  scaleContent?: boolean;
  contentAlign?: ContentAlign;
  forcePresenceTransition?: boolean;
  persistBounds?: boolean;
}

interface PresenceTransitionOptions {
  enterKeyframes?: Keyframes;
  exitKeyframes?: Keyframes | 'reversedEnter';
  useLayoutProxyAsRoot?: boolean;
}

type TransitionOptions = CommonTransitionOptions & MutationTransitionOptions & PresenceTransitionOptions;

type ContentAlign =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerRight'
  | 'bottomRight'
  | 'bottomCenter'
  | 'bottomLeft'
  | 'centerLeft'
  | 'center';

type PositionAnchor = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

type RelevantStyleProperties = Exclude<keyof CSS.PropertiesHyphen, 'pointer-events'>[];
```

### Options

#### `debug`

If enabled, performed transitions will never be finished and snapshots will never be removed from DOM so you can easily inspect page in "frozen" state to identify issues.

#### `transitionOptions`

Default transition options.

### Default values

```ts
const defaults: ConfigurableDefaults = {
  debug: false,
  transitionOptions: {
    duration: 300,
    easing: 'ease',
    delay: 0,
    ignoreReducedMotion: false,
    enterKeyframes: { opacity: [0, 1] },
    exitKeyframes: { opacity: [1, 0] },
    useLayoutProxyAsRoot: false,
    contentEnterKeyframes: { opacity: [0, 1, 1] },
    contentExitKeyframes: { opacity: [1, 1, 0] },
    scaleContent: false,
    contentAlign: 'topLeft',
    positionAnchor: 'topLeft',
    forcePresenceTransition: false,
    root: undefined,
    clip: true,
    relevantStyleProperties: [],
    persistBounds: true,
    transitionLayout: false,
    captureDynamicStatesDepth: 0,
    captureTransform: false,
    disabled: false,
  },
};
```

### Usage

```ts
import { defaults } from 'react-smooth-flow';

defaults.transitionOptions.duration = 600;
defaults.transitionOptions.easing = 'linear';
defaults.transitionOptions.ignoreReducedMotion = true;
```

## usePreCommitEffect

`usePreCommitEffect` is a hook similar to [useEffect](https://react.dev/reference/react/useEffect). It is not recommended to use this hook as it has less control over transition flow. Callback gets executed before [commit step](https://react.dev/learn/render-and-commit), which allows us to use it for snapshot capturing as DOM it not updated yet. Callback also accepts boolean argument which represent wether it is first render.

### Type declaration

```ts
declare const usePreCommitEffect: (
  effect: (isInitialRender: boolean) => void | (() => void),
  deps?: React.DependencyList
) => void;
```

### Usage

```ts
const [state, setState] = useState(someState);

usePreCommitEffect(
  (isInitialRender) => {
    if (!isInitialRender) {
      startTransition(['tagA']);
    }
  },
  [state]
);

return (
  <Binder transitions={{ tagA: {} }}>
    <div onClick={() => setState(someNewStateValue)}>{state}</div>
  </Binder>
);

// INSTEAD OF

const [state, setState] = useState(someState);

return (
  <Binder transitions={{ tagA: {} }}>
    <div onClick={() => startTransition(['tagA'], () => setState(someNewStateValue))}>
      {state}
    </div>
  </Binder>
);
```
