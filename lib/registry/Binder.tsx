'use client';

import stableStringify from 'json-stable-stringify';
import { cloneElement, DetailedHTMLProps, HTMLAttributes, memo, ReactElement, useEffect, useState } from 'react';
import { Tag, TransitionMapping, TransitionOptions } from '../types';
import { registerRoot, registerTransitioned, unregisterRoot, unregisterTransitioned } from './store';

interface Props {
  children: ReactElement<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>;
  transitions?: TransitionMapping<TransitionOptions>;
  root?: Tag;
  refPropName?: string;
}

const Binder = ({ children, transitions, root, refPropName = 'ref' }: Props) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [syncedTransitions, setSyncedTransitions] = useState<TransitionMapping<TransitionOptions>>();
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

  return cloneElement(children, {
    [refPropName]: (node: HTMLElement | null) => {
      setElement(node);

      setSyncedTransitions((prev) => {
        if (stableStringify(prev) === stableStringify(transitions)) {
          return prev;
        }

        return transitions;
      });

      setSyncedRootTag(root);

      const { [refPropName as keyof typeof children.props]: ref } = children.props;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        ref.current = node;
      }
    },
  });
};

export default memo(Binder);
