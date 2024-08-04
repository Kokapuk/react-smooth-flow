import { Dispatch, useEffect, useState } from 'react';

const useDelayedState = <T>(
  initialState: T,
  updateOnChange?: boolean
): [{ relevant: T; delayed: T }, Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState(initialState);
  const [delayedState, setDelayedState] = useState(initialState);

  useEffect(() => {
    if (!updateOnChange) {
      return;
    }

    setState(initialState);
  }, [initialState, updateOnChange]);

  useEffect(() => {
    setDelayedState(state);
  }, [state]);

  return [{ relevant: state, delayed: delayedState }, setState];
};

export default useDelayedState;
