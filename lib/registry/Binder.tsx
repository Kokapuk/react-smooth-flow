'use client';

import React, { DetailedHTMLProps, HTMLAttributes, ReactElement, useEffect, useState } from 'react';
import { Tag, TransitionMapping } from '../types';
import { registerRoot, registerTransitioned, unregisterRoot, unregisterTransitioned } from './store';

interface TransitionedProps {
  children: ReactElement<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>;
  transitions?: TransitionMapping;
  root?: Tag;
}

const Binder = ({ children, transitions, root }: TransitionedProps) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [syncedTransitions, setSyncedTransitions] = useState<TransitionMapping>();
  const [syncedRootTag, setSyncedRootTag] = useState<Tag>();

  useEffect(() => {
    if (!element || !syncedTransitions) {
      return;
    }

    registerTransitioned(element, syncedTransitions);

    return () => {
      unregisterTransitioned(element);
    };
  }, [element, syncedTransitions]);

  useEffect(() => {
    if (!element || !syncedRootTag) {
      return;
    }

    registerRoot(syncedRootTag, element);

    return () => {
      unregisterRoot(syncedRootTag);
    };
  }, [element, syncedRootTag]);

  return React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      setElement(node);
      setSyncedTransitions(transitions);
      setSyncedRootTag(root);

      const { ref: originalRef } = children.props;

      if (typeof originalRef === 'function') {
        originalRef(node);
      } else if (originalRef && typeof originalRef === 'object') {
        originalRef.current = node;
      }
    },
  });
};

export default Binder;
