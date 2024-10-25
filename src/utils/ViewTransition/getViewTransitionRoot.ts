export default () => {
  const viewTransitionRoot = document.getElementById('viewTransitionRoot');

  if (!viewTransitionRoot) {
    throw new Error('Element with id "viewTransitionRoot" does not exist');
  }

  return viewTransitionRoot;
};
