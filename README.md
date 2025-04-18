# React Smooth Flow

Implement animations for entering, exiting, and updating elements without much effort. React Smooth Flow is designed to simplify complex animations while providing control over transition behavior, making it suitable for any React project, from small components to large SPAs.

## Install

Run one of the following commands to add **React Smooth Flow** to your project:

```bash
npm i react-smooth-flow
```

```bash
pnpm add react-smooth-flow
```

```bash
yarn add react-smooth-flow
```

### Additional steps

Some library features require global import of styles. If you skip this step, you may get unexpected behavior of animations.

```js
// Import at root, e.g. Next.js: app/layout, Vite: src/main, etc.
import 'react-smooth-flow/style.min.css';
```

## Usage

Let's create your first animation! Start by creating a new component.

```tsx
import { useState } from 'react';

export default function ExpandableSection() {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <>
      {isExpanded ? (
        <section
          style={{
            background: 'white',
            color: 'black',
            fontSize: 22,
            width: 300,
            padding: 25,
            borderRadius: 25,
          }}
        >
          <button
            onClick={() => setExpanded(false)}
            style={{
              float: 'right',
              width: 25,
              height: 25,
              marginLeft: 5,
              marginBottom: 5,
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            X
          </button>
          <p>Lorem...</p>
        </section>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          style={{
            background: 'white',
            color: 'black',
            fontSize: 18,
            padding: '7px 10px',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Expand
        </button>
      )}
    </>
  );
}
```

![First animation - step 1](/.github/assets/first-animation-step-1.gif)

Now let's spice things up with a few lines of code

```diff
import { useState } from 'react';
+ import { Binder, startTransition, TransitionOptions } from 'react-smooth-flow';

+ const sectionTransitionProperties: TransitionOptions = {
+  duration: 500,
+  contentEnterKeyframes: { opacity: [0, 0, 1] },
+  contentExitKeyframes: 'reversedEnter',
+ };

export default function ExpandableSection() {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <>
      {isExpanded ? (
+       <Binder transitions={{ section: sectionTransitionProperties }}>
          <section
            style={{
              background: 'white',
              color: 'black',
              fontSize: 22,
              width: 300,
              padding: 25,
              borderRadius: 25,
            }}
          >
            <button
-             onClick={() => setExpanded(false)}
+             onClick={() => startTransition(['section'], () => setExpanded(false))}
              style={{
                float: 'right',
                width: 25,
                height: 25,
                marginLeft: 5,
                marginBottom: 5,
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              X
            </button>
            <p>
              Lorem...
            </p>
          </section>
+       </Binder>
      ) : (
+       <Binder transitions={{ section: sectionTransitionProperties }}>
          <button
-           onClick={() => setExpanded(true)}
+           onClick={() => startTransition(['section'], () => setExpanded(true))}
            style={{
              background: 'white',
              color: 'black',
              fontSize: 18,
              padding: '7px 10px',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Expand
          </button>
+       </Binder>
      )}
    </>
  );
}
```

![First animation - step 2](/.github/assets/first-animation-step-2.gif)

## Advantages over [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

- supports all major modern browsers
- higher customizability
- provides more control over the document, you can specify which elements will be animated per call

  ```js
  document.startViewTransition(() => updateDOMSync());
  // VS
  startTransition(['tag1', 'tag2'...], () => updateDOMSync());
  ```

  Since only specific parts of the document get animated, the entire view is not getting blocked while animations are running, but only animated elements. This also allows us to run multiple animations at the same time for different elements and previous animation will not be interrupted.

- allows to specify a root for an element on animation

  By default all animations get performed on so-called overlay root. This avoids issues with cross-container transitions where element moves between containers, but if at least one of these have `overflow` of any other value than `visible`, you'll get unexpected behavior of an animation. But in some cases you may want to intentionally restrict visibility of an element while animated. Or you may want your animation to tolerate complex-moving element, like with `position: sticky` or `translate` animation running on it. That's where [root](/DOCS.md#Root) comes into play.

## Disadvantages over [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

- cross-document transitions are technically impossible

  Keep in mind that you can still implement animations between routes in [SPAs](https://developer.mozilla.org/en-US/docs/Glossary/SPA). React Smooth Flow even allows you to create shared element transitions.

- losing some states on transition

  React Smooth Flow has a simpler way of capturing snapshots of elements. It does not take a screenshot, but uses the [cloneNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode) instead. That means that some states that are not represented as attributes will not be captured, e.g. input values without `value` attribute, scroll position of scrollable elements, etc. You can read more about snapshot capturing process [here](/DOCS.md#Concept).

## Known issues

- Mutation transition behavior for **display: none** and **visibility: hidden** is unexpected

## License

React Smooth Flow is [MIT-licensed](/LICENSE) open-source software by Kokapuk.

## Contact

If you need a help or have any questions, feel free to reach out through any of following:

- [Telegram](https://t.me/kokapuk)
- [Discord](https://discord.com/users/387664775473135617)
- yarik.pavlov.971@gmail.com
