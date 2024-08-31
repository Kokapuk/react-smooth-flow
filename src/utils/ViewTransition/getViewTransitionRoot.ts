const getViewTransitionRoot = () => {
  const viewTransitionRoot = document.getElementById('viewTransitionRoot');

  if (!viewTransitionRoot) {
    throw new Error('Element with id "viewTransitionRoot" does not exist');
  }

  return viewTransitionRoot;
};
export default getViewTransitionRoot;
