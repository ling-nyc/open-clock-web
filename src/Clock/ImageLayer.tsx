import { FunctionComponent } from 'react';
import type { LayerProps } from './LayerProps';

/**
 * Render an image layer defined in the clock specification.
 *
 * @param layer - Layer configuration including the image file name.
 * @param assets - Map of available assets keyed by filename.
 */
const ImageLayer: FunctionComponent<LayerProps> = ({
  layer: { filename, scale },
  assets,
  position: { x, y },
}) => {
  const asset = filename ? assets[filename] : null;

  // If no image filename specified or no asset found, render nothing
  if (!filename || !asset) {
    return null;
  }

  // Scale images to be proportional to the coordinate system
  // Use a scaling factor that makes images appropriately sized
  const s = Number(scale) * 0.8; // Adjusted scaling factor
  const width = asset.width * s;
  const height = asset.height * s;

  return (
    <image
      href={asset.url}
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
    />
  );
};

export default ImageLayer;
