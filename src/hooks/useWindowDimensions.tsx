import { useCallback, useEffect, useState } from 'react';
import { WindowDimensionsObject } from '../types';

const getWindowDimensions = (): WindowDimensionsObject => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

const useWindowDimensions = (): WindowDimensionsObject => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensionsObject>(getWindowDimensions());

  const handleResize = useCallback(() => setWindowDimensions(getWindowDimensions()), []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowDimensions;
};

export default useWindowDimensions;
