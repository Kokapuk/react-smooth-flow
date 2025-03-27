import constructTransition from './constructTransition';
import constructTransitionRoot from './constructTransitionRoot';
import defaults, { ConfigurableDefaults } from './defaults';
import startTransition from './startTransition';
import './style.scss';
import usePreCommitEffect from './usePreCommitEffect';

import { cancelTransition } from './store';
import {
  FalsyArray,
  ParsedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
} from './types';

export {
  cancelTransition,
  constructTransition,
  constructTransitionRoot,
  defaults,
  startTransition,
  usePreCommitEffect,
};

export type {
  ConfigurableDefaults,
  FalsyArray,
  ParsedTransitionOptions,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionOptions,
};
