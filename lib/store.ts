import getTruthyArray from './getTruthyArray';
import { FalsyArray, Id, Store, Tag } from './types';

const activeTransitions: Store = {};

export const setupRecord = () => {
  const id = `${Date.now()}-${Math.random().toString(36)}`;
  activeTransitions[id] = {};

  return id;
};

export const getRecordById = (id: Id) => activeTransitions[id];

export const getRecordByTag = (tag: Tag) =>
  Object.entries(activeTransitions).find(([_, record]) => Object.keys(record).includes(tag))?.[1];

export const getAllTransitions = () =>
  Object.keys(activeTransitions)
    .flatMap((tag) => Object.values(activeTransitions[tag]).flat())
    .flatMap((record) => Object.values(record));

export const getTransitionsById = (id: Id) =>
  Object.keys(activeTransitions[id]).flatMap((tag) => Object.values(activeTransitions[id][tag]));

export const cancelTransition = (...tags: FalsyArray<Tag>) => {
  const validTags = getTruthyArray(tags);
  const recordIds = Object.entries(activeTransitions)
    .filter(([_, record]) => Object.keys(record).some((tag) => validTags.includes(tag)))
    .map((i) => i[0]);
  const records = recordIds.map((id) => activeTransitions[id]);
  const transitions = records.flatMap((record) => Object.keys(record).flatMap((tag) => Object.values(record[tag])));

  transitions.forEach((i) => {
    i.animation.cancel();
    i.cleanup?.();
  });

  recordIds.forEach((id) => delete activeTransitions[id]);
};

export const finishTransition = (id: Id) => {
  const tags = Object.keys(activeTransitions[id]);
  const transitions = tags.flatMap((tag) => Object.values(activeTransitions[id][tag]));

  transitions.forEach((i) => {
    i.animation.cancel();
    i.cleanup?.();
  });

  delete activeTransitions[id];
};
