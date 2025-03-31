const getTransitionRoot = () => {
  const transitionRootId = 'transitionRoot';
  let transitionRoot = document.getElementById(transitionRootId);

  if (!transitionRoot) {
    transitionRoot = document.createElement('div');
    transitionRoot.id = transitionRootId;
    transitionRoot.ariaHidden = 'true';

    document.body.append(transitionRoot);
    document.documentElement.style.position = 'relative';
  }

  return transitionRoot;
};

export default getTransitionRoot;
