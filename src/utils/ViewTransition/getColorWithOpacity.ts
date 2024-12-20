const getColorWithOpacity = (originalColor: string, opacity: number | string) => {
  const matches = originalColor.match(/(?:\d+)?\.?\d+/gm);

  if (!matches || matches.length < 3) {
    throw Error('Failed to convert a color');
  }

  const rgb = matches.slice(0, 3).join(', ');
  const originalOpacity = matches.length === 4 ? +matches[3] : 1;
  const newOpacity = +opacity;

  if (isNaN(originalOpacity) || isNaN(newOpacity)) {
    throw Error('Failed to convert a color');
  }

  return `rgba(${rgb}, ${newOpacity * originalOpacity})`;
};

export default getColorWithOpacity;
