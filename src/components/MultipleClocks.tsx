import { useMemo, forwardRef } from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import Fullscreenable from './Fullscreenable';
import Clock from '../Clock';
import type { ClockWrapper } from '../open-clock';

interface Props {
  clocks: readonly ClockWrapper[];
  height: number;
  ratio: number;
}

/**
 * MultipleClocks component displays a carousel of clocks using pure-react-carousel.
 * Users can swipe or use navigation buttons to view different clocks.
 *
 * Props:
 * - clocks: Array of clock data to display.
 * - height: Height of each clock display.
 * - ratio: Width/height ratio for each clock.
 */
const MultipleClocks = forwardRef<
  { enterFullscreen: () => Promise<boolean>; exitFullscreen: () => Promise<boolean>; isFullscreen: boolean },
  Props
>(({ clocks, height, ratio }, ref) => {
  // Memoized style object for consistent sizing of carousel and clocks
  const style = useMemo(
    () => ({
      height,
      width: height * ratio,
    }),
    [height, ratio]
  );

  return (
    <CarouselProvider
      naturalSlideHeight={height}
      naturalSlideWidth={height * ratio}
      totalSlides={clocks.length}
      infinite
    >
      <Fullscreenable ref={ref}>
        <Slider style={style}>
          {clocks.map((clock, index) => (
            <Slide index={index} key={clock.clockStandard.title}>
              <Clock
                clock={clock}
                height={height}
                ratio={ratio}
                wrapper={false}
              />
            </Slide>
          ))}
        </Slider>
      </Fullscreenable>
      <ButtonBack>«</ButtonBack>
      <ButtonNext>»</ButtonNext>
    </CarouselProvider>
  );
});

MultipleClocks.displayName = 'MultipleClocks';

export default MultipleClocks;
