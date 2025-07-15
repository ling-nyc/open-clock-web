import { FunctionComponent, useCallback, useRef } from 'react';

/**
 * Wrap children with a button to request fullscreen display.
 *
 * @returns Wrapper element with fullscreen controls.
 */
const Fullscreenable: FunctionComponent = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const enter = useCallback(() => {
    ref.current?.firstElementChild?.requestFullscreen({
      navigationUI: 'show',
    });
  }, [ref]);

  return (
    <>
      <button type="button" onClick={enter}>
        Fullscreen
      </button>
      <div ref={ref}>{children}</div>
    </>
  );
};

export default Fullscreenable;
