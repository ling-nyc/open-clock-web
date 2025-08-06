import { FunctionComponent, useEffect, useRef } from 'react';
import type { HandProps } from './types';

/**
 * SVG image-based clock hand with optional smooth animation.
 *
 * @param assets - Map of decoded assets used to look up the image.
 * @param layer - Layer definition containing the image information.
 * @param angle - Current rotation angle in degrees.
 * @param animationType - If "smooth", animate one second sweep.
 */
const ImageHand: FunctionComponent<HandProps> = ({
  assets,
  layer: { scale, filename: layerFilename, imageFilename: layerImageFilename },
  position: { x, y },
  angle,
  handOptions: { imageAnchorX = '0.5', imageAnchorY = '0.5', imageFilename: handImageFilename },
  animationType,
}) => {
  const ref = useRef<SVGImageElement | null>(null);
  useEffect(() => {
    if (animationType === 'smooth') {
      const anim = ref.current?.animate(
        [
          { transform: `rotate(${angle}deg)` },
          { transform: `rotate(${angle + 6}deg)` },
        ],
        {
          duration: 1000,
          iterations: 1,
        }
      );
      return () => anim?.cancel();
    } else {
      return undefined;
    }
  }, [ref, angle, x, y, animationType]);

  // Check both locations for imageFilename (backward compatibility)
  const imageFilename = handImageFilename || layerFilename || layerImageFilename;
  const asset = imageFilename ? assets[imageFilename] : null;
  if (!asset) {
    return null;
  }
  // Scale images to be proportional to the coordinate system
  // Use a scaling factor that makes images appropriately sized
  const s = Number(scale) * 0.8; // Adjusted scaling factor
  const width = asset.width * s;
  const height = asset.height * s;
  const cx = Number(imageAnchorX);
  const cy = Number(imageAnchorY);
  const transform = `rotate(${angle} ${x} ${y})`;
  return (
    <image
      ref={ref}
      href={asset.url}
      width={width}
      height={height}
      x={x - width * cx}
      y={y - height * cy}
      transform={transform}
    />
  );
};

export default ImageHand;
