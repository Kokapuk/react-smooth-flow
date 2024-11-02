const getViewTransitionRoot = () => {
  const viewTransitionRootId = 'viewTransitionRoot';
  const viewTransitionRoot = document.getElementById(viewTransitionRootId);

  if (!viewTransitionRoot) {
    throw Error(`Element with id "${viewTransitionRootId}" does not exist`);
  }

  return viewTransitionRoot;
};

export default getViewTransitionRoot;
