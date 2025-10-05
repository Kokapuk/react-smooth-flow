import { Binder, startTransition, startViewTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';

export default function ViewTransition() {
  const [pos, setPos] = useState<'left' | 'right'>('left');

  return (
    <Example title="View Transition" style={{ width: 250 }}>
      <Binder
        transitions={{
          viewTransition: {
            duration: 600,
            enterKeyframes: { transform: ['scale(0)', 'scale(1)'], opacity: [0, 1] },
            exitKeyframes: [
              { transform: 'scale(1)', opacity: 1 },
              { transform: 'scale(0)', opacity: 0 },
            ],
            // viewTransitionPlayMutationTransition: true, // by default
            // viewTransitionPlayPresenceTransition: true // by default
          },
        }}
      >
        <Button
          style={{ marginLeft: pos === 'right' ? 'auto' : undefined }}
          onClick={() => {
            // @ts-expect-error ...
            (document.startViewTransition ? startViewTransition : startTransition)(['viewTransition'], () =>
              setPos((prev) => (prev === 'left' ? 'right' : 'left'))
            );
          }}
        >
          {pos === 'left' ? '->' : '<-'}
        </Button>
      </Binder>
    </Example>
  );
}
