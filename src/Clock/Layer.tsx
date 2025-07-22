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
  [ClockLayerTypeEnum.BatteryIndicator]: undefined,
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
  debug?: boolean;
  onMissingImage?: (name: string) => void;
  onMissingFont?: (name: string) => void;
}

/**
 * Render a single clock layer using the appropriate component.
 *
 * @param theta
 */
const radiansToDegrees = (theta: string | number): number => {
  const rads = typeof theta === 'number' ? theta : Number(theta);
  return (rads * 180) / Math.PI;
};

const Layer: FunctionComponent<Props> = ({
  ratio,
  layer,
  assets,
  debug = false,
  onMissingImage,
  onMissingFont,
}) => {
  const position = useMemo(
    () => ({
      x: Number(layer.horizontalPosition) * 100,
      y: Number(layer.verticalPosition) * -100,
    }),
    [ratio, layer.horizontalPosition, layer.verticalPosition]
  );

  // Check for missing images in this layer
  useEffect(() => {
    // Check if this layer references an image that isn't in assets
    if (
      onMissingImage &&
      layer.imageFilename &&
      layer.imageFilename.trim() !== ''
    ) {
      if (!assets[layer.imageFilename]) {
        console.log(`Missing image detected: ${layer.imageFilename}`);
        onMissingImage(layer.imageFilename);
      }
    }

    // Check for hand layers with image hands
    if (
      onMissingImage &&
      layer.type === ClockLayerTypeEnum.Hand &&
      layer.handOptions?.useImage
    ) {
      // Check both locations for imageFilename (backward compatibility)
      const handImageFilename = layer.handOptions.imageFilename || layer.imageFilename;
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

  const transform =
    layer.angleOffset === '0.0'
      ? undefined
      : `rotate(${radiansToDegrees(layer.angleOffset || '0')},${position.x},${
          position.y
        })`;

  return (
    <g opacity={layer.alpha} transform={transform}>
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
      />
    </g>
  );
};

export default Layer;
