/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent, HTMLAttributes } from 'react';

interface MaybeWrapperProps extends HTMLAttributes<HTMLDivElement> {
  render: boolean;
}

/**
 * Conditionally wrap children in a div when `render` is true.
 *
 * Any additional props are passed to the wrapping div.
 */
const MaybeWrapper: FunctionComponent<MaybeWrapperProps> = ({
  render,
  children,
  ...rest
}) => (render ? <div {...rest}>{children}</div> : <>{children}</>);

export default MaybeWrapper;
