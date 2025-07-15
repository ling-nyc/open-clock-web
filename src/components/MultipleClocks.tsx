import { FunctionComponent, useMemo } from 'react';
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
 * Display a carousel of clocks that can be swiped or navigated through.
 */
const MultipleClocks: FunctionComponent<Props> = ({
  clocks,
  height,
  ratio,
}) => {
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
      <Fullscreenable>
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
};

export default MultipleClocks;
