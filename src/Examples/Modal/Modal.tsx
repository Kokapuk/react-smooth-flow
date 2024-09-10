import cn from 'classnames';
import { useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import Button from '../../components/Button';
import Example from '../../components/Example';
import constructViewTransition from '../../utils/ViewTransition/constructViewTransition';
import startViewTransition from '../../utils/ViewTransition/startViewTransition';
import styles from './Modal.module.scss';

const Modal = () => {
  const [isOpen, setOpen] = useState(false);
  const [isMaximized, setMaximized] = useState(false);

  const toggleMaximized = () => {
    startViewTransition(['modal', 'controls'], { duration: 600 }, () => flushSync(() => setMaximized((prev) => !prev)));
  };

  return (
    <Example title="Modal">
      <Button onClick={() => setOpen(true)}>Open</Button>
      {isOpen &&
        createPortal(
          <div className={cn(styles.backdrop, isMaximized && styles.maximized)}>
            <div
              className={cn(styles.modal, isMaximized && styles.maximized)}
              {...constructViewTransition({ tag: 'modal' })}
            >
              <div className={styles.controls} {...constructViewTransition({ tag: 'controls' })}>
                <button onClick={toggleMaximized} className={styles.controlBtn}>
                  {isMaximized ? '⇲' : '⇱'}
                </button>
                <button onClick={() => setOpen(false)} className={styles.controlBtn}>
                  ×
                </button>
              </div>
              <h2>Some content goes here</h2>
              <p>I do not know anything else</p>
            </div>
          </div>,
          document.getElementById('modalRoot')!
        )}
    </Example>
  );
};

export default Modal;
