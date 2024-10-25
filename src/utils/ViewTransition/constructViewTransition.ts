import { ViewTransitionProperties } from './types';

export default (properties: ViewTransitionProperties) => ({
  'data-viewtransition': JSON.stringify(properties),
});
