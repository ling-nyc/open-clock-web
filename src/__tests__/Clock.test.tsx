import { render, screen as testScreen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Clock from '../Clock';
import {
  ClockWrapper,
  ClockLayerType,
  ClockLayerTextCasing,
  ClockLayerTextJustification,
} from '../open-clock';

const mockClock: ClockWrapper = {
  clockStandard: {
    title: 'Test',
    version: '1.0',
    layers: [
      {
        alpha: '1.0',
        angleOffset: '0.0',
        customName: '',
        fillColor: '#000000',
        horizontalPosition: '0.0',
        imageFilename: '',
        isHidden: false,
        scale: '1.0',
        type: ClockLayerType.Text,
        verticalPosition: '0.0',
        zIndex: 0,
        textOptions: {
          casingType: ClockLayerTextCasing.None,
          customText: 'hello world',
          effectType: '',
          fontDescription: '',
          fontFilename: '',
          justification: ClockLayerTextJustification.Centered,
          kerning: '0',
          outlineColor: '#000000',
          outlineWidth: '0',
          fontFamily: 'Arial',
        },
      },
    ],
  },
};

test('renders clock text', () => {
  render(<Clock clock={mockClock} height={100} wrapper={false} />);
  expect(testScreen.getByText('hello world')).toBeInTheDocument();
});
