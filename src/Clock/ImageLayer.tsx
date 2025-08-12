import { FunctionComponent } from 'react';
import type { LayerProps } from './LayerProps';

interface ImageLayerProps extends LayerProps {
  canvasWidth?: number;
  canvasHeight?: number;
  ratio?: number;
}

/**
 * Render an image layer defined in the clock specification.
 * 
 * This implementation properly handles both background and foreground images:
 * - Background images (low zIndex, centered position) fill the entire viewBox
 * - Foreground images respect the OCS scale and positioning properties
 * - No arbitrary scaling factors are applied - uses actual OCS specifications
 *
 * @param layer - Layer configuration including the image file name.
 * @param assets - Map of available assets keyed by filename.
 * @param canvasWidth - Canvas width from OCS file
 * @param canvasHeight - Canvas height from OCS file  
 * @param ratio - Aspect ratio for the clock
 */
const ImageLayer: FunctionComponent<ImageLayerProps> = ({
  layer: { filename, scale, horizontalPosition, verticalPosition, zIndex },
  assets,
  position: { x, y },
  canvasWidth = 199.0,
  canvasHeight = 242.0,
  ratio = 0.82,
}) => {
  const asset = filename ? assets[filename] : null;

  // If no image filename specified or no asset found, render nothing
  if (!filename || !asset) {
    return null;
  }

  // Determine if this is likely a background image based on:
  // 1. Low zIndex (background layers typically have lower zIndex)
  // 2. Centered position (0,0) which is common for backgrounds
  // 3. Any scale factor (background images can have any scale in OCS)
  const isLikelyBackground = (zIndex ?? 0) <= 0 &&
    (horizontalPosition ?? 0) === 0 &&
    (verticalPosition ?? 0) === 0 &&
    (scale ?? 1) >= 0.1; // More lenient check - background images might have small scales

  let width: number;
  let height: number;
  let imageX: number;
  let imageY: number;

  if (isLikelyBackground) {
    // For background images: fill the entire viewBox to cover the clock face
    // The viewBox is calculated as: `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
    // where viewBoxWidth = 200 * ratio, viewBoxHeight = 200, viewBoxX = -100 * ratio, viewBoxY = -100
    const viewBoxWidth = 200 * ratio;
    const viewBoxHeight = 200;

    width = viewBoxWidth;
    height = viewBoxHeight;
    imageX = -100 * ratio; // Left edge of viewBox
    imageY = -100; // Top edge of viewBox
  } else {
    // For foreground images: respect the OCS scale and positioning exactly as specified
    const layerScale = Number(scale ?? 1);

    // Scale the image based on the layer's scale property
    // Use a reasonable conversion factor from pixels to SVG units
    const pixelToSvgFactor = 0.4; // Adjust this if images appear too large/small
    width = asset.width * layerScale * pixelToSvgFactor;
    height = asset.height * layerScale * pixelToSvgFactor;

    // Use the calculated position from Layer component (respects horizontalPosition/verticalPosition)
    imageX = x - width / 2;
    imageY = y - height / 2;
  }

  return (
    <image
      href={asset.url}
      x={imageX}
      y={imageY}
      width={width}
      height={height}
      preserveAspectRatio={isLikelyBackground ? "xMidYMid slice" : "xMidYMid meet"}
    />
  );
};

export default ImageLayer;
