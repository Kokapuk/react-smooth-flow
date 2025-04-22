import { ParsedTransitionOptions, Tag, TransitionMapping } from '../types';
import fillDefaultsTransitionMapping from './fillDefaultsTransitionMapping';
import filterDisabled from './filterDisabled';
import validateTransitionMapping from './validateTransitionMapping';

const transitionMappings = new Map<HTMLElement, TransitionMapping<ParsedTransitionOptions>>();
const transitionedElements = new Map<Tag, HTMLElement>();
const rootElements = new Map<Tag, HTMLElement>();

export const registerTransitioned = (element: HTMLElement, transitions: TransitionMapping) => {
  filterDisabled(transitions);
  validateTransitionMapping(transitions, Array.from(transitionMappings.values()));

  const tags = Object.keys(transitions);
  tags.forEach((tag) => transitionedElements.set(tag, element));

  if (tags.length) {
    element.dataset.transitioned = tags.join(' ');
  }

  fillDefaultsTransitionMapping(transitions);
  transitionMappings.set(element, transitions as TransitionMapping<ParsedTransitionOptions>);
};

export const unregisterTransitioned = (element: HTMLElement) => {
  const transitionMapping = transitionMappings.get(element) as TransitionMapping<ParsedTransitionOptions> | undefined;

  if (!transitionMapping) {
    return;
  }

  const tags = Object.keys(transitionMapping);
  tags.forEach((tag) => transitionedElements.delete(tag));
  delete element.dataset.transitioned;

  transitionMappings.delete(element);
};

export const getTransitioned = (tag: Tag) => {
  const foundElement = transitionedElements.get(tag);

  if (!foundElement) {
    return null;
  }

  if (transitionMappings.get(foundElement)?.[tag].disabled) {
    return null;
  }

  return foundElement;
};

export const getTransitionMapping = (element: HTMLElement) => transitionMappings.get(element);

export const registerRoot = (tag: Tag, element: HTMLElement) => {
  if (Array.from(rootElements.keys()).includes(tag)) {
    throw Error(
      `Failed to register root element, element with following tag is already registered: "${tag}". Tags should be unique`
    );
  }

  element.dataset.root = tag;
  rootElements.set(tag, element);
};

export const unregisterRoot = (tag: Tag) => {
  delete getRoot(tag)?.dataset.root;
  rootElements.delete(tag);
};

export const getRoot = (tag: Tag) => {
  return rootElements.get(tag);
};
