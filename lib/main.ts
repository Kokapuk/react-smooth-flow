import defaults, { ConfigurableDefaults } from './defaults';
import startTransition from './startTransition';
import './style.scss';
import usePreCommitEffect from './usePreCommitEffect';

import Binder from './registry/Binder';
import { cancelTransition } from './store';
import {
  FalsyArray,
  ParsedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
} from './types';

export { Binder, cancelTransition, defaults, startTransition, usePreCommitEffect };

export type {
  ConfigurableDefaults,
  FalsyArray,
  ParsedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
};
