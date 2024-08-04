import { Dispatch, useEffect, useState } from 'react';

const useDelayedState = <T>(initialState: T): [{ relevant: T; delayed: T }, Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState(initialState);
  const [delayedState, setDelayedState] = useState(initialState);

  useEffect(() => {
    setDelayedState(state);
  }, [state]);

  return [{ relevant: state, delayed: delayedState }, setState];
};

export default useDelayedState;
