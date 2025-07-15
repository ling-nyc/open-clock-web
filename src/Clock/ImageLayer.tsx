import type { FunctionComponent } from 'react';
import type { LayerProps } from './LayerProps';

/**
 * Render an image layer defined in the clock specification.
 *
 * @param layer - Layer configuration including the image file name.
 * @param assets - Map of available assets keyed by filename.
 * @param position - Calculated x/y position of the layer.
 */
const ImageLayer: FunctionComponent<LayerProps> = ({
  layer: { imageFilename, scale },
  assets,
  position: { x, y },
}) => {
  const asset = assets[imageFilename];
  if (!asset) {
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
