import { FunctionComponent, useEffect } from 'react';
import type { LayerProps } from './LayerProps';
import { useAssetWarnings } from './AssetWarningContext';

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
  const { addWarning } = useAssetWarnings();
  const asset = assets[imageFilename];

  // Report missing image to the warning context
  useEffect(() => {
    if (imageFilename && imageFilename.trim() !== '' && !asset) {
      console.log(`Detected missing image: "${imageFilename}"`);
      addWarning({ type: 'image', name: imageFilename });
    }
  }, [imageFilename, asset, addWarning]); // Reorder dependencies to put the ones that change most often first

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
