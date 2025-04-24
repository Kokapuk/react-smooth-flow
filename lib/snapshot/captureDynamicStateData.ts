import { DynamicStateData } from '../types';

const captureDynamicStateData = (targetElement: HTMLElement) => {
  const dynamicStateData: DynamicStateData = {
    scrollTop: targetElement.scrollTop,
    scrollLeft: targetElement.scrollLeft,
  };

  return dynamicStateData;
};

export default captureDynamicStateData;
