export default (originalColor: string, opacity: number | string) => {
  const matches = originalColor.match(/(?:\d+)?\.?\d+/gm);

  if (!matches || matches.length < 3) {
    throw new Error('Failed to convert color');
  }

  const rgb = matches.slice(0, 3).join(', ');
  const originalOpacity = matches.length === 4 ? +matches[3] : 1;
  const newOpacity = +opacity;

  if (isNaN(originalOpacity) || isNaN(newOpacity)) {
    throw new Error('Failed to convert color');
  }

  return `rgba(${rgb}, ${newOpacity * originalOpacity})`;
};
