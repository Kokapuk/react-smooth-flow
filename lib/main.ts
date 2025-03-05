import cancelTransition from './Transition/cancelTransition';
import constructTransition from './Transition/constructTransition';
import constructTransitionRoot from './Transition/constructTransitionRoot';
import startTransition from './Transition/startTransition';
import './Transition/style.scss';

import {
  FalsyArray,
  ParsedTransitionProperties,
  Tag,
  TransitionConfig,
  TransitionMapping,
  TransitionProperties,
} from './Transition/types';

export { cancelTransition, constructTransition, constructTransitionRoot, startTransition };

export type { FalsyArray, ParsedTransitionProperties, Tag, TransitionConfig, TransitionMapping, TransitionProperties };
