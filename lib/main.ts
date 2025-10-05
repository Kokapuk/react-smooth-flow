import defaults, { ConfigurableDefaults } from './defaults';
import './style.scss';
import startTransition from './transition/startTransition';
import usePreCommitEffect from './usePreCommitEffect';

import Binder from './registry/Binder';
import { cancelTransition } from './store';
import startViewTransition from './transition/startViewTransition';
import {
  FalsyArray,
  ResolvedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
  UpdateCallback,
  ViewTransitionConfig,
} from './types';

export { Binder, cancelTransition, defaults, startTransition, startViewTransition, usePreCommitEffect };

export type {
  ConfigurableDefaults,
  FalsyArray,
  ResolvedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
  UpdateCallback,
  ViewTransitionConfig,
};
