import cancelTransition from './cancelTransition';
import constructTransition from './constructTransition';
import constructTransitionRoot from './constructTransitionRoot';
import defaults, { ConfigurableDefaults } from './defaults';
import startTransition from './startTransition';
import './style.scss';

import {
  FalsyArray,
  ParsedTransitionProperties,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionProperties,
} from './types';

export { cancelTransition, constructTransition, constructTransitionRoot, defaults, startTransition };

export type {
  ConfigurableDefaults,
  FalsyArray,
  ParsedTransitionProperties,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionProperties,
};
