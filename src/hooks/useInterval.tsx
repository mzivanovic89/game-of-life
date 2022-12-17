import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay: number): void => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  });
};

export default useInterval;
