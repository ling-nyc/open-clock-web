// Backward compatibility utilities for OpenClockStandard schema updates

import { ClockStandard, ClockLayer, ClockLayerDataLabelOptions } from './index';

/**
 * Legacy interfaces for backward compatibility
 */
interface LegacyClockStandard {
    version?: string | number;
    title: string;
    layers: LegacyClockLayer[];
}

interface LegacyClockLayer {
    type: string;
    zIndex: number;
    customName?: string;
    imageFilename?: string;
    filename?: string;
    fillColor?: string;
    alpha?: string | number;
    horizontalPosition?: string | number;
    verticalPosition?: string | number;
    scale?: string | number;
    angleOffset?: string | number;
    isHidden?: boolean;
    dataSource?: string;
    textOptions?: LegacyTextOptions;
    dataLabelOptions?: LegacyDataLabelOptions;
    [key: string]: any;
}

interface LegacyTextOptions {
    outlineWidth?: string | number;
    kerning?: string | number;
    [key: string]: any;
}

interface LegacyDataLabelOptions {
    unitDisplayLevel?: string;
    dataLabelFormat?: string;
    [key: string]: any;
}

/**
 * Converts string positioning values to numbers
 */
function convertStringToNumber(value: string | number | undefined, defaultValue: number = 0): number {
    if (value === undefined || value === null) {
        return defaultValue;
    }

    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        // Handle empty strings
        if (value.trim() === '') {
            return defaultValue;
        }

        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    return defaultValue;
}

/**
 * Converts legacy version format to number
 */
function convertVersion(version: string | number | undefined): number {
    if (version === undefined || version === null) {
        return 1.0;
    }

    if (typeof version === 'number') {
        return version;
    }

    if (typeof version === 'string') {
        // Handle empty strings
        if (version.trim() === '') {
            return 1.0;
        }

        const parsed = parseFloat(version);
        return isNaN(parsed) ? 1.0 : parsed;
    }

    return 1.0;
}

/**
 * Migrates dataLabelFormat to dataSource for backward compatibility
 */
function migrateDataLabelFormat(layer: LegacyClockLayer): string | undefined {
    // If dataSource is already present, use it
    if (layer.dataSource) {
        return layer.dataSource;
    }

    // Check if dataLabelOptions has dataLabelFormat
    if (layer.dataLabelOptions?.dataLabelFormat) {
        // Map old dataLabelFormat values to new dataSource values
        const formatMapping: Record<string, string> = {
            'Steps': 'Steps',
            'StepsLong': 'Steps',
            'StepsShort': 'StepCount',
            'StepsSymbol': 'StepCount',
            'HeartRate': 'HeartRate',
            'EnergyBurned': 'EnergyBurned',
            'EnergyBurnedGoal': 'EnergyBurnedGoal',
            'ExerciseTime': 'ExerciseTime',
            'ExerciseTimeGoal': 'ExerciseTimeGoal',
            'StandTime': 'StandTime',
            'StandTimeGoal': 'StandTimeGoal',
            'DistanceWalkRun': 'DistanceWalkRun',
            'DistanceWalkRunUnit': 'DistanceWalkRunUnit',
            'FlightsClimbed': 'FlightsClimbed',
            'Temperature': 'Temperature',
            'TempertureMin': 'TempertureMin',
            'TempertureMax': 'TempertureMax',
            'Sunrise': 'Sunrise',
            'Sunset': 'Sunset',
            'FeelsLike': 'FeelsLike',
            'ChanceOfPrecip': 'ChanceOfPrecip',
            'RainAmount': 'RainAmount',
            'WeatherDescription': 'WeatherDescription',
            'WeatherDescriptionCaps': 'WeatherDescriptionCaps',
            'WeatherIcon': 'WeatherIcon',
            'Battery': 'Battery',
            'BatteryNum': 'BatteryNum',
            'BatteryLevel': 'BatteryLevel'
        };

        return formatMapping[layer.dataLabelOptions.dataLabelFormat] || layer.dataLabelOptions.dataLabelFormat;
    }

    return undefined;
}

/**
 * Migrates a legacy layer to the new format
 */
function migrateLayer(legacyLayer: LegacyClockLayer): ClockLayer {
    const layer: ClockLayer = {
        type: legacyLayer.type as any,
        zIndex: legacyLayer.zIndex,
        customName: legacyLayer.customName,
        filename: legacyLayer.filename || legacyLayer.imageFilename,
        fillColor: legacyLayer.fillColor,
        alpha: convertStringToNumber(legacyLayer.alpha, 1.0),
        horizontalPosition: convertStringToNumber(legacyLayer.horizontalPosition, 0.0),
        verticalPosition: convertStringToNumber(legacyLayer.verticalPosition, 0.0),
        scale: convertStringToNumber(legacyLayer.scale, 1.0),
        angleOffset: convertStringToNumber(legacyLayer.angleOffset, 0.0),
        isHidden: legacyLayer.isHidden,
        dataSource: migrateDataLabelFormat(legacyLayer) as any,
    };

    // Migrate text options
    if (legacyLayer.textOptions) {
        layer.textOptions = {
            ...legacyLayer.textOptions,
            outlineWidth: convertStringToNumber(legacyLayer.textOptions.outlineWidth, 0),
            kerning: convertStringToNumber(legacyLayer.textOptions.kerning, 0),
        };
    }

    // Migrate data label options (remove dataLabelFormat)
    if (legacyLayer.dataLabelOptions) {
        const { dataLabelFormat, ...cleanDataLabelOptions } = legacyLayer.dataLabelOptions;
        layer.dataLabelOptions = cleanDataLabelOptions as ClockLayerDataLabelOptions;
    }

    // Copy other options as-is
    if (legacyLayer.iconOptions) layer.iconOptions = legacyLayer.iconOptions;
    if (legacyLayer.weatherOptions) layer.weatherOptions = legacyLayer.weatherOptions;
    if (legacyLayer.handOptions) layer.handOptions = legacyLayer.handOptions;
    if (legacyLayer.dataBarOptions) layer.dataBarOptions = legacyLayer.dataBarOptions;
    if (legacyLayer.dataRingOptions) layer.dataRingOptions = legacyLayer.dataRingOptions;

    return layer;
}

/**
 * Migrates a legacy ClockStandard to the new format
 */
export function migrateClockStandard(legacy: LegacyClockStandard): ClockStandard {
    return {
        version: convertVersion(legacy.version),
        title: legacy.title,
        layers: legacy.layers.map(migrateLayer),
    };
}

/**
 * Checks if a ClockStandard object needs migration
 */
export function needsMigration(clockStandard: any): boolean {
    try {
        // Handle null/undefined input
        if (!clockStandard || typeof clockStandard !== 'object') {
            return false;
        }

        // Check version format
        if (typeof clockStandard.version === 'string') {
            return true;
        }

        // Check if any layer has string positioning values
        if (Array.isArray(clockStandard.layers) && clockStandard.layers.some((layer: any) =>
            layer && (
                typeof layer.alpha === 'string' ||
                typeof layer.horizontalPosition === 'string' ||
                typeof layer.verticalPosition === 'string' ||
                typeof layer.scale === 'string' ||
                typeof layer.angleOffset === 'string' ||
                layer.imageFilename !== undefined ||
                layer.dataLabelOptions?.dataLabelFormat !== undefined
            )
        )) {
            return true;
        }

        return false;
    } catch (error) {
        console.warn('Error checking if migration is needed:', error);
        return false;
    }
}

/**
 * Detects the intended canvas size based on layer positioning and content
 */
function detectIntendedCanvasSize(clockStandard: any): { width: number; height: number; type: 'watchFace' | 'squareWidget' | 'rectangularWidget' } {
    // If canvas is already specified, use it
    if (clockStandard.canvas) {
        return clockStandard.canvas;
    }

    // Analyze layers to detect intended canvas size
    if (Array.isArray(clockStandard.layers)) {
        // Check for extreme positioning values that suggest Apple Watch dimensions
        const hasExtremePositioning = clockStandard.layers.some((layer: any) => {
            const hPos = Math.abs(layer.horizontalPosition || 0);
            const vPos = Math.abs(layer.verticalPosition || 0);
            return hPos > 0.8 || vPos > 0.8;
        });

        // Check for small scale values that suggest larger canvas
        const hasSmallScales = clockStandard.layers.some((layer: any) => {
            const scale = layer.scale || 1.0;
            return scale < 0.3;
        });

        // Check for hand layers (common in Apple Watch faces)
        const hasHandLayers = clockStandard.layers.some((layer: any) =>
            layer.type === 'hand'
        );

        // Check for data bars (common in Apple Watch faces)
        const hasDataBars = clockStandard.layers.some((layer: any) =>
            layer.type === 'dataBar'
        );

        // If it has characteristics of an Apple Watch face, use Apple Watch dimensions
        if ((hasExtremePositioning || hasSmallScales) && (hasHandLayers || hasDataBars)) {
            return {
                width: 312.0,
                height: 390.0,
                type: 'watchFace'
            };
        }
    }

    // Default to original dimensions
    return {
        width: 199.0,
        height: 242.0,
        type: 'watchFace'
    };
}

/**
 * Provides default values for missing properties
 */
export function applyDefaults(clockStandard: ClockStandard): ClockStandard {
    // Handle null/undefined input
    if (!clockStandard || typeof clockStandard !== 'object') {
        return {
            version: 1.0,
            title: 'Untitled Clock',
            canvas: {
                width: 199.0,
                height: 242.0,
                type: 'watchFace'
            },
            layers: []
        };
    }

    // Detect intended canvas size
    const detectedCanvas = detectIntendedCanvasSize(clockStandard);

    return {
        version: clockStandard.version ?? 1.0,
        title: clockStandard.title || 'Untitled Clock',
        canvas: clockStandard.canvas ?? detectedCanvas,
        layers: Array.isArray(clockStandard.layers) ? clockStandard.layers.map(layer => ({
            ...layer,
            alpha: layer.alpha ?? 1.0,
            horizontalPosition: layer.horizontalPosition ?? 0.0,
            verticalPosition: layer.verticalPosition ?? 0.0,
            scale: layer.scale ?? 1.0,
            angleOffset: layer.angleOffset ?? 0.0,
            isHidden: layer.isHidden ?? false,
        })) : []
    };
}

/**
 * Detects the schema version based on the structure and properties
 */
export function detectSchemaVersion(clockStandard: any): number {
    try {
        // Handle null/undefined input
        if (!clockStandard || typeof clockStandard !== 'object') {
            return 1.0;
        }

        // If version is explicitly set, use it (after conversion)
        if (clockStandard.version !== undefined) {
            return convertVersion(clockStandard.version);
        }

        // Check for new schema features to infer version
        if (clockStandard.canvas) {
            return 1.0; // Canvas property indicates newer schema
        }

        // Check if any layer has new properties
        if (Array.isArray(clockStandard.layers) && clockStandard.layers.some((layer: any) =>
            layer && (
                layer.dataSource !== undefined ||
                (typeof layer.alpha === 'number' &&
                    typeof layer.horizontalPosition === 'number' &&
                    typeof layer.verticalPosition === 'number')
            )
        )) {
            return 1.0;
        }

        // Default to older version if no new features detected
        return 0.9;
    } catch (error) {
        console.warn('Error detecting schema version:', error);
        return 1.0; // Default to current version
    }
}

/**
 * Validates that required properties exist after migration
 */
export function validateMigratedSchema(clockStandard: ClockStandard): boolean {
    try {
        // Check required top-level properties
        if (!clockStandard.title || !Array.isArray(clockStandard.layers)) {
            return false;
        }

        // Check that version is a number
        if (typeof clockStandard.version !== 'number') {
            return false;
        }

        // Check each layer has required properties
        for (const layer of clockStandard.layers) {
            if (!layer.type || typeof layer.zIndex !== 'number') {
                return false;
            }

            // Check that numeric properties are actually numbers
            if (layer.alpha !== undefined && typeof layer.alpha !== 'number') {
                return false;
            }
            if (layer.horizontalPosition !== undefined && typeof layer.horizontalPosition !== 'number') {
                return false;
            }
            if (layer.verticalPosition !== undefined && typeof layer.verticalPosition !== 'number') {
                return false;
            }
            if (layer.scale !== undefined && typeof layer.scale !== 'number') {
                return false;
            }
            if (layer.angleOffset !== undefined && typeof layer.angleOffset !== 'number') {
                return false;
            }
        }

        return true;
    } catch (error) {
        console.warn('Error validating migrated schema:', error);
        return false;
    }
}

/**
 * Comprehensive migration function that handles all backward compatibility
 */
export function migrateToCurrentSchema(input: any): ClockStandard {
    try {
        // First check if migration is needed
        if (!needsMigration(input)) {
            return applyDefaults(input as ClockStandard);
        }

        // Perform migration
        const migrated = migrateClockStandard(input);

        // Apply defaults to ensure all properties are present
        const withDefaults = applyDefaults(migrated);

        // Validate the result
        if (!validateMigratedSchema(withDefaults)) {
            console.warn('Migration validation failed, using input as-is with defaults');
            return applyDefaults(input as ClockStandard);
        }

        return withDefaults;
    } catch (error) {
        console.error('Error during schema migration:', error);
        // Fallback: try to apply defaults to original input
        try {
            return applyDefaults(input as ClockStandard);
        } catch (fallbackError) {
            console.error('Fallback migration also failed:', fallbackError);
            // Return minimal valid schema
            return {
                version: 1.0,
                title: input?.title || 'Untitled Clock',
                canvas: {
                    width: 199.0,
                    height: 242.0,
                    type: 'watchFace'
                },
                layers: []
            };
        }
    }
}