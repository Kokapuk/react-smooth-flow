import { useMemo } from 'react';

const useViewTransitionUUID = () => {
  const id = useMemo(() => crypto.randomUUID(), []);

  return id;
};

export default useViewTransitionUUID;
