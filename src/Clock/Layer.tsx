import { ComponentType, FunctionComponent, useMemo, useEffect } from 'react';
import { ClockLayer, ClockLayerType, ClockLayerTypeEnum } from '../open-clock';
import TextLayer from './TextLayer';
import type { Assets, LayerProps } from './LayerProps';
import HandLayer from './HandLayer';
import ImageLayer from './ImageLayer';

const layerTypes: Record<
  ClockLayerType,
  ComponentType<LayerProps> | undefined
> = {
  [ClockLayerTypeEnum.DataBar]: undefined,
  [ClockLayerTypeEnum.DataLabel]: undefined,
  [ClockLayerTypeEnum.DataRing]: undefined,
  [ClockLayerTypeEnum.DateTime]: TextLayer,
  [ClockLayerTypeEnum.Hand]: HandLayer,
  [ClockLayerTypeEnum.Icon]: undefined,
  [ClockLayerTypeEnum.Image]: ImageLayer,
  [ClockLayerTypeEnum.Text]: TextLayer,
};

interface Props {
  ratio: number;
  layer: ClockLayer;
  assets: Assets;
  canvasWidth?: number;
  canvasHeight?: number;
  debug?: boolean;
  onMissingImage?: (name: string) => void;
  onMissingFont?: (name: string) => void;
}

/**
 * Render a single clock layer using the appropriate component.
 */

const Layer: FunctionComponent<Props> = ({
  ratio,
  layer,
  assets,
  canvasWidth = 199.0,
  canvasHeight = 242.0,
  debug = false,
  onMissingImage,
  onMissingFont,
}) => {
  const position = useMemo(
    () => {
      // Handle numeric positioning values with canvas size awareness
      const horizontalPos = layer.horizontalPosition ?? 0;
      const verticalPos = layer.verticalPosition ?? 0;

      // Convert normalized coordinates (-1 to 1) to SVG coordinates
      // For horizontal: -1 = left edge, 0 = center, 1 = right edge
      // For vertical: -1 = top edge, 0 = center, 1 = bottom edge
      const x = horizontalPos * 100 * ratio;
      const y = verticalPos * 100; // Positive Y goes down in SVG

      return { x, y };
    },
    [ratio, layer.horizontalPosition, layer.verticalPosition, canvasWidth, canvasHeight]
  );

  // Check for missing images in this layer
  useEffect(() => {
    // Check if this layer references an image that isn't in assets
    if (
      onMissingImage &&
      layer.filename &&
      layer.filename.trim() !== ''
    ) {
      if (!assets[layer.filename]) {
        console.log(`Missing image detected: ${layer.filename}`);
        onMissingImage(layer.filename);
      }
    }

    // Check for hand layers with image hands
    if (
      onMissingImage &&
      layer.type === ClockLayerTypeEnum.Hand &&
      layer.handOptions?.useImage
    ) {
      // Check both locations for imageFilename (backward compatibility)
      const handImageFilename = layer.handOptions.imageFilename || layer.filename;
      if (handImageFilename && handImageFilename.trim() !== '') {
        if (!assets[handImageFilename]) {
          console.log(
            `Missing hand image detected: ${handImageFilename}`
          );
          onMissingImage(handImageFilename);
        }
      }
    }
  }, [layer, assets, onMissingImage]);

  if (layer.isHidden) {
    return null;
  }

  const LayerType = layerTypes[layer.type];
  if (LayerType === undefined) {
    // not implemented yet
    return null;
  }

  // Handle rotation transforms only - each layer type handles its own scaling
  const angleOffset = layer.angleOffset ?? 0;

  const transforms = [];

  // Add rotation transform if needed (angleOffset is in degrees)
  if (angleOffset !== 0) {
    transforms.push(`rotate(${angleOffset},${position.x},${position.y})`);
  }

  // Note: Scale transforms are handled by individual layer components:
  // - TextLayer: uses scale for fontSize calculation
  // - ImageLayer: uses scale for width/height calculation  
  // - HandLayer: uses scale for hand sizing (SVG sprites or image hands)

  const transform = transforms.length > 0 ? transforms.join(' ') : undefined;

  return (
    <g opacity={layer.alpha ?? 1.0} transform={transform}>
      {debug && (
        <circle
          r={2}
          stroke="red"
          strokeWidth={1}
          cx={position.x}
          cy={position.y}
        />
      )}
      <LayerType
        assets={assets}
        position={position}
        layer={layer}
        onMissingFont={onMissingFont}
        {...(layer.type === ClockLayerTypeEnum.Image && {
          canvasWidth,
          canvasHeight,
          ratio
        })}
      />
    </g>
  );
};

export default Layer;
