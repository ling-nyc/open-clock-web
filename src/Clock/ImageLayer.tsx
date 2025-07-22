import { FunctionComponent } from 'react';
import type { LayerProps } from './LayerProps';

/**
 * Render an image layer defined in the clock specification.
 *
 * @param layer - Layer configuration including the image file name.
 * @param assets - Map of available assets keyed by filename.
 */
const ImageLayer: FunctionComponent<LayerProps> = ({
  layer: { imageFilename, scale },
  assets,
  position: { x, y },
}) => {
  const asset = imageFilename ? assets[imageFilename] : null;

  // If no image filename specified or no asset found, render nothing
  if (!imageFilename || !asset) {
    return null;
  }

  const s = (Number(scale) * 200) / 275;
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
