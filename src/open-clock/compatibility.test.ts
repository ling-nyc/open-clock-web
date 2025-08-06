import {
    migrateClockStandard,
    needsMigration,
    applyDefaults,
    detectSchemaVersion,
    validateMigratedSchema,
    migrateToCurrentSchema
} from './compatibility';

describe('Schema Compatibility', () => {
    describe('needsMigration', () => {
        it('should return true for string version', () => {
            const clockStandard = {
                version: '1.0',
                title: 'Test Clock',
                layers: []
            };
            expect(needsMigration(clockStandard)).toBe(true);
        });

        it('should return true for string positioning values', () => {
            const clockStandard = {
                version: 1.0,
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime',
                    zIndex: 0,
                    alpha: '1.0',
                    horizontalPosition: '0.5'
                }]
            };
            expect(needsMigration(clockStandard)).toBe(true);
        });

        it('should return true for imageFilename property', () => {
            const clockStandard = {
                version: 1.0,
                title: 'Test Clock',
                layers: [{
                    type: 'image',
                    zIndex: 0,
                    imageFilename: 'test.png'
                }]
            };
            expect(needsMigration(clockStandard)).toBe(true);
        });

        it('should return false for new format', () => {
            const clockStandard = {
                version: 1.0,
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime',
                    zIndex: 0,
                    alpha: 1.0,
                    horizontalPosition: 0.5,
                    filename: 'test.png'
                }]
            };
            expect(needsMigration(clockStandard)).toBe(false);
        });

        it('should handle errors gracefully', () => {
            const result = needsMigration(null);
            expect(result).toBe(false);

            // Test with undefined
            const result2 = needsMigration(undefined);
            expect(result2).toBe(false);

            // Test with non-object
            const result3 = needsMigration('not an object');
            expect(result3).toBe(false);
        });
    });

    describe('migrateClockStandard', () => {
        it('should convert string version to number', () => {
            const legacy = {
                version: '1.0',
                title: 'Test Clock',
                layers: []
            };
            const migrated = migrateClockStandard(legacy);
            expect(migrated.version).toBe(1.0);
        });

        it('should convert string positioning to numbers', () => {
            const legacy = {
                version: '1.0',
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime',
                    zIndex: 0,
                    alpha: '0.8',
                    horizontalPosition: '0.5',
                    verticalPosition: '-0.2',
                    scale: '1.5',
                    angleOffset: '45'
                }]
            };
            const migrated = migrateClockStandard(legacy);
            const layer = migrated.layers[0];
            expect(layer.alpha).toBe(0.8);
            expect(layer.horizontalPosition).toBe(0.5);
            expect(layer.verticalPosition).toBe(-0.2);
            expect(layer.scale).toBe(1.5);
            expect(layer.angleOffset).toBe(45);
        });

        it('should migrate imageFilename to filename', () => {
            const legacy = {
                version: '1.0',
                title: 'Test Clock',
                layers: [{
                    type: 'image',
                    zIndex: 0,
                    imageFilename: 'test.png'
                }]
            };
            const migrated = migrateClockStandard(legacy);
            expect(migrated.layers[0].filename).toBe('test.png');
        });

        it('should migrate dataLabelFormat to dataSource', () => {
            const legacy = {
                version: '1.0',
                title: 'Test Clock',
                layers: [{
                    type: 'dataLabel',
                    zIndex: 0,
                    dataLabelOptions: {
                        dataLabelFormat: 'Steps'
                    }
                }]
            };
            const migrated = migrateClockStandard(legacy);
            expect(migrated.layers[0].dataSource).toBe('Steps');
            // dataLabelFormat should be removed during migration
            expect((migrated.layers[0].dataLabelOptions as any)?.dataLabelFormat).toBeUndefined();
        });

        it('should convert text option numbers', () => {
            const legacy = {
                version: '1.0',
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime',
                    zIndex: 0,
                    textOptions: {
                        outlineWidth: '2.5',
                        kerning: '1.2'
                    }
                }]
            };
            const migrated = migrateClockStandard(legacy);
            const textOptions = migrated.layers[0].textOptions;
            expect(textOptions?.outlineWidth).toBe(2.5);
            expect(textOptions?.kerning).toBe(1.2);
        });
    });

    describe('applyDefaults', () => {
        it('should apply default version', () => {
            const clockStandard = {
                title: 'Test Clock',
                layers: [] as any[]
            };
            const withDefaults = applyDefaults(clockStandard as any);
            expect(withDefaults.version).toBe(1.0);
        });

        it('should apply default canvas for simple clocks', () => {
            const clockStandard = {
                title: 'Test Clock',
                layers: [] as any[]
            };
            const withDefaults = applyDefaults(clockStandard as any);
            expect(withDefaults.canvas).toEqual({
                width: 199.0,
                height: 242.0,
                type: 'watchFace'
            });
        });

        it('should detect Apple Watch canvas size for clocks with extreme positioning', () => {
            const clockStandard = {
                title: 'Apple Watch Clock',
                layers: [{
                    type: 'hand',
                    zIndex: 0,
                    horizontalPosition: -0.85,
                    verticalPosition: 0.89,
                    scale: 0.2
                }]
            };
            const withDefaults = applyDefaults(clockStandard as any);
            expect(withDefaults.canvas).toEqual({
                width: 312.0,
                height: 390.0,
                type: 'watchFace'
            });
        });

        it('should detect Apple Watch canvas size for clocks with data bars and small scales', () => {
            const clockStandard = {
                title: 'Apple Watch Clock',
                layers: [{
                    type: 'dataBar',
                    zIndex: 0,
                    scale: 0.2,
                    verticalPosition: -0.84
                }]
            };
            const withDefaults = applyDefaults(clockStandard as any);
            expect(withDefaults.canvas).toEqual({
                width: 312.0,
                height: 390.0,
                type: 'watchFace'
            });
        });

        it('should apply layer defaults', () => {
            const clockStandard = {
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime' as const,
                    zIndex: 0
                }]
            };
            const withDefaults = applyDefaults(clockStandard as any);
            const layer = withDefaults.layers[0];
            expect(layer.alpha).toBe(1.0);
            expect(layer.horizontalPosition).toBe(0.0);
            expect(layer.verticalPosition).toBe(0.0);
            expect(layer.scale).toBe(1.0);
            expect(layer.angleOffset).toBe(0.0);
            expect(layer.isHidden).toBe(false);
        });

        it('should not override existing values', () => {
            const clockStandard = {
                version: 2.0,
                title: 'Test Clock',
                canvas: { width: 300, height: 300, type: 'squareWidget' as const },
                layers: [{
                    type: 'dateTime' as const,
                    zIndex: 0,
                    alpha: 0.5,
                    horizontalPosition: 0.8
                }]
            };
            const withDefaults = applyDefaults(clockStandard);
            expect(withDefaults.version).toBe(2.0);
            expect(withDefaults.canvas?.width).toBe(300);
            expect(withDefaults.layers[0].alpha).toBe(0.5);
            expect(withDefaults.layers[0].horizontalPosition).toBe(0.8);
        });
    });

    describe('detectSchemaVersion', () => {
        it('should detect version from explicit version property', () => {
            const clockStandard = {
                version: '1.5',
                title: 'Test Clock',
                layers: []
            };
            expect(detectSchemaVersion(clockStandard)).toBe(1.5);
        });

        it('should detect newer schema from canvas property', () => {
            const clockStandard = {
                title: 'Test Clock',
                canvas: { width: 200, height: 200 },
                layers: []
            };
            expect(detectSchemaVersion(clockStandard)).toBe(1.0);
        });

        it('should detect newer schema from dataSource property', () => {
            const clockStandard = {
                title: 'Test Clock',
                layers: [{
                    type: 'dataLabel',
                    zIndex: 0,
                    dataSource: 'Steps'
                }]
            };
            expect(detectSchemaVersion(clockStandard)).toBe(1.0);
        });

        it('should detect older schema from string positioning', () => {
            const clockStandard = {
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime',
                    zIndex: 0,
                    alpha: '1.0',
                    horizontalPosition: '0.5'
                }]
            };
            expect(detectSchemaVersion(clockStandard)).toBe(0.9);
        });

        it('should handle errors gracefully', () => {
            expect(detectSchemaVersion(null)).toBe(1.0);
            expect(detectSchemaVersion(undefined)).toBe(1.0);
        });
    });

    describe('validateMigratedSchema', () => {
        it('should validate correct schema', () => {
            const clockStandard = {
                version: 1.0,
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime' as const,
                    zIndex: 0,
                    alpha: 1.0,
                    horizontalPosition: 0.0
                }]
            };
            expect(validateMigratedSchema(clockStandard)).toBe(true);
        });

        it('should reject schema without title', () => {
            const clockStandard = {
                version: 1.0,
                layers: []
            };
            expect(validateMigratedSchema(clockStandard as any)).toBe(false);
        });

        it('should reject schema with string version', () => {
            const clockStandard = {
                version: '1.0',
                title: 'Test Clock',
                layers: []
            };
            expect(validateMigratedSchema(clockStandard as any)).toBe(false);
        });

        it('should reject layers with string positioning values', () => {
            const clockStandard = {
                version: 1.0,
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime' as const,
                    zIndex: 0,
                    alpha: '1.0'
                }]
            };
            expect(validateMigratedSchema(clockStandard as any)).toBe(false);
        });
    });

    describe('migrateToCurrentSchema', () => {
        it('should migrate legacy schema successfully', () => {
            const legacy = {
                version: '1.0',
                title: 'Test Clock',
                layers: [{
                    type: 'dateTime',
                    zIndex: 0,
                    alpha: '0.8',
                    horizontalPosition: '0.5'
                }]
            };
            const migrated = migrateToCurrentSchema(legacy);
            expect(migrated.version).toBe(1.0);
            expect(migrated.layers[0].alpha).toBe(0.8);
            expect(migrated.layers[0].horizontalPosition).toBe(0.5);
            expect(migrated.canvas).toBeDefined();
        });

        it('should handle already migrated schema', () => {
            const current = {
                version: 1.0,
                title: 'Test Clock',
                canvas: { width: 199, height: 242, type: 'watchFace' as const },
                layers: [{
                    type: 'dateTime' as const,
                    zIndex: 0,
                    alpha: 0.8
                }]
            };
            const result = migrateToCurrentSchema(current);
            expect(result.version).toBe(1.0);
            expect(result.layers[0].alpha).toBe(0.8);
        });

        it('should handle invalid input gracefully', () => {
            const result = migrateToCurrentSchema(null);
            expect(result.version).toBe(1.0);
            expect(result.title).toBe('Untitled Clock');
            expect(result.layers).toEqual([]);
        });

        it('should handle corrupted input gracefully', () => {
            const corrupted = {
                title: 'Test Clock',
                layers: 'not an array'
            };
            const result = migrateToCurrentSchema(corrupted);
            expect(result.version).toBe(1.0);
            expect(result.title).toBe('Test Clock');
            expect(result.layers).toEqual([]);
        });
    });
});