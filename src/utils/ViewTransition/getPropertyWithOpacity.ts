const getPropertyWithOpacity = (property: string, opacity: number | string) => {
  return property.replace(/rgba?\((\d+?),\s(\d+?),\s(\d+?)(?:,\s([\d.]+?))?\)/gm, (_, r, g, b, a) => {
    const originalOpacity = a ? +a : 1;
    const newOpacity = originalOpacity * (typeof opacity === 'string' ? +opacity : opacity);

    if (newOpacity === 1) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `rgba(${r}, ${g}, ${b}, ${newOpacity})`;
    }
  });
};

export default getPropertyWithOpacity;
