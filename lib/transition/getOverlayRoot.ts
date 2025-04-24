const getOverlayRoot = () => {
  let root = document.querySelector('rsf-overlay-root');

  if (!root) {
    root = document.createElement('rsf-overlay-root');
    root.ariaHidden = 'true';

    document.body.append(root);
    document.documentElement.style.position = 'relative';
  }

  return root;
};

export default getOverlayRoot;
