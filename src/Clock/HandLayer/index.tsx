import type { FunctionComponent } from 'react';
import type { LayerProps } from '../LayerProps';
import { useTime } from '../../TimeContext';
import { ClockLayerHandTypesEnum } from '../../open-clock';
import ImageHand from './ImageHand';
import angleExtractors from './angleExtractors';

/**
 * Render an analog clock hand based on the current time.
 *
 * @param assets - Map of assets to use when rendering image hands.
 * @param layer - Layer configuration describing the hand options.
 * @param position - Position of the hand pivot point.
 */
const HandLayer: FunctionComponent<LayerProps> = ({
  assets,
  layer,
  position,
}) => {
  const now = useTime();

  const { handOptions } = layer;
  if (!handOptions) {
    return null;
  }

  const fraction = angleExtractors[handOptions.handType || ClockLayerHandTypesEnum.Hour](now);
  const angle = 360 * ((handOptions.animateClockwise || false) ? fraction : 1 - fraction);

  if (handOptions.useImage) {
    return (
      <ImageHand
        layer={layer}
        position={position}
        assets={assets}
        angle={angle}
        handOptions={handOptions}
        animationType={
          handOptions.handType === ClockLayerHandTypesEnum.Second ? 'smooth' : 'set'
        }
      />
    );
  } else {
    return (
      <use
        href={`#${handOptions.handStyle || 'default'}`}
        transform={`rotate(${angle} ${position.x} ${position.y})`}
      />
    );
  }
};

export default HandLayer;
