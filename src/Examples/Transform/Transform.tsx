import { Binder, startTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';

const Transform = () => {
  const [isRotated, setRotated] = useState(false);

  return (
    <Example title="Transform" style={{ width: 400, height: 250, display: 'grid', placeItems: 'center' }}>
      <Binder transitions={{ transformButton: { duration: 600, captureTransform: true } }}>
        <Button
          onClick={() => startTransition(['transformButton'], () => setRotated((prev) => !prev))}
          style={{ transform: isRotated ? 'rotate(-45deg)' : 'rotate(45deg)', transformOrigin: 'top left' }}
        >
          Click to rotate{isRotated ? ' again' : ''}
        </Button>
      </Binder>
      <Button onClick={() => startTransition(['transformButton'], () => setRotated((prev) => !prev))}>Rotate</Button>
    </Example>
  );
};

export default Transform;
