import { render, screen as testingScreen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Clock from '../Clock';
import {
  ClockWrapper,
  ClockLayerTypeEnum,
  ClockLayerTextCasingEnum,
  ClockLayerTextJustificationEnum,
} from '../open-clock';

const mockClock: ClockWrapper = {
  clockStandard: {
    title: 'Test',
    version: 1.0,
    layers: [
      {
        alpha: 1.0,
        angleOffset: 0.0,
        customName: '',
        fillColor: '#000000',
        horizontalPosition: 0.0,
        imageFilename: '',
        isHidden: false,
        scale: 1.0,
        type: ClockLayerTypeEnum.Text,
        verticalPosition: 0.0,
        zIndex: 0,
        textOptions: {
          casingType: ClockLayerTextCasingEnum.None,
          customText: 'hello world',
          effectType: '',
          fontFilename: '',
          justification: ClockLayerTextJustificationEnum.Centered,
          kerning: 0,
          outlineColor: '#000000',
          outlineWidth: 0,
          fontFamily: 'HelveticaNeue-Bold',
        },
      },
    ],
  },
};

test('renders clock text', () => {
  render(<Clock clock={mockClock} height={100} wrapper={false} />);
  expect(testingScreen.getByText('hello world')).toBeInTheDocument();
});
