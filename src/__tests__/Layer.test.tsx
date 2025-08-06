import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layer from '../Clock/Layer';
import { ClockLayer, ClockLayerTypeEnum } from '../open-clock';

const mockLayer: ClockLayer = {
    type: ClockLayerTypeEnum.Text,
    zIndex: 0,
    horizontalPosition: 0.5,
    verticalPosition: -0.3,
    scale: 1.2,
    angleOffset: 45,
    alpha: 0.8,
    textOptions: {
        customText: 'Test Text',
        fontFamily: 'HelveticaNeue-Bold',
    },
};

const mockAssets = {};

describe('Layer Component', () => {
    test('calculates position correctly with numeric values', () => {
        const { container } = render(
            <svg>
                <Layer
                    ratio={0.82}
                    layer={mockLayer}
                    assets={mockAssets}
                    canvasWidth={199}
                    canvasHeight={242}
                />
            </svg>
        );

        const gElement = container.querySelector('g');
        expect(gElement).toBeInTheDocument();

        // Check that transform includes both rotation and scale
        const transform = gElement?.getAttribute('transform');
        expect(transform).toContain('rotate(45');
        expect(transform).toContain('scale(1.2)');

        // Check opacity
        expect(gElement?.getAttribute('opacity')).toBe('0.8');
    });

    test('handles default values correctly', () => {
        const layerWithDefaults: ClockLayer = {
            type: ClockLayerTypeEnum.Text,
            zIndex: 0,
            textOptions: {
                customText: 'Test Text',
                fontFamily: 'HelveticaNeue-Bold',
            },
        };

        const { container } = render(
            <svg>
                <Layer
                    ratio={0.82}
                    layer={layerWithDefaults}
                    assets={mockAssets}
                />
            </svg>
        );

        const gElement = container.querySelector('g');
        expect(gElement).toBeInTheDocument();

        // Should have default opacity of 1.0
        expect(gElement?.getAttribute('opacity')).toBe('1');

        // Should not have transform when all values are defaults
        expect(gElement?.getAttribute('transform')).toBeNull();
    });

    test('handles hidden layers', () => {
        const hiddenLayer: ClockLayer = {
            ...mockLayer,
            isHidden: true,
        };

        const { container } = render(
            <svg>
                <Layer
                    ratio={0.82}
                    layer={hiddenLayer}
                    assets={mockAssets}
                />
            </svg>
        );

        // Should render nothing for hidden layers
        expect(container.querySelector('g')).toBeNull();
    });
});