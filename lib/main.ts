import defaults, { ConfigurableDefaults } from './defaults';
import startTransition from './transition/startTransition';
import './style.scss';
import usePreCommitEffect from './usePreCommitEffect';

import Binder from './registry/Binder';
import { cancelTransition } from './store';
import {
  FalsyArray,
  ResolvedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
} from './types';

export { Binder, cancelTransition, defaults, startTransition, usePreCommitEffect };

export type {
  ConfigurableDefaults,
  FalsyArray,
  ResolvedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
};
