const getTransitionRoot = () => {
  const transitionRootId = 'transitionRoot';
  let transitionRoot = document.getElementById(transitionRootId);

  if (!transitionRoot) {
    transitionRoot = document.createElement('div');
    transitionRoot.id = transitionRootId;
    document.body.append(transitionRoot);
  }

  return transitionRoot;
};

export default getTransitionRoot;
