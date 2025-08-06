import Ajv, { ErrorObject } from 'ajv';
import { ClockWrapper } from './open-clock';
import { migrateClockStandard, needsMigration, applyDefaults } from './open-clock/compatibility';
import schema from '../schemas/ClockWrapper.json';

export interface ClockParseResult {
  clock: ClockWrapper;
  migrated?: boolean;
}

export type ParseResult =
  | ClockParseResult
  | { errors: readonly ErrorObject[] }
  | { exception: string };

const ajv = new Ajv();
const validate = ajv.compile(schema);

/**
 * Parse a clock JSON string and validate it against the schema.
 * Automatically handles backward compatibility and migration.
 *
 * @param json - Raw JSON string representing a clock.
 * @returns Parsed clock wrapper or validation errors/exception info.
 */
const parser = (json: string): ParseResult => {
  try {
    const rawClock = JSON.parse(json);
    let clock = rawClock;
    let migrated = false;

    // Check if the clock needs migration
    if (clock.clockStandard && needsMigration(clock.clockStandard)) {
      console.log('Migrating legacy clock format to new schema');
      clock = {
        ...clock,
        clockStandard: migrateClockStandard(clock.clockStandard)
      };
      migrated = true;
    }

    // Apply default values
    if (clock.clockStandard) {
      clock.clockStandard = applyDefaults(clock.clockStandard);
    }

    // Validate against schema
    const valid = validate(clock);
    if (valid) {
      return {
        clock: clock as unknown as ClockWrapper,
        migrated
      };
    } else {
      // If validation fails after migration, try to provide helpful error messages
      const errors = validate.errors || [];
      console.warn('Clock validation failed:', errors);

      // Enhance error messages for common issues
      const enhancedErrors = errors.map(error => {
        if (error.instancePath.includes('version') && error.keyword === 'type') {
          return {
            ...error,
            message: 'Version should be a number (e.g., 1.0) not a string. This may indicate an older clock format.'
          };
        }
        if (error.instancePath.includes('Position') && error.keyword === 'type') {
          return {
            ...error,
            message: 'Position values should be numbers (e.g., 0.5) not strings. This may indicate an older clock format.'
          };
        }
        if (error.instancePath.includes('alpha') && error.keyword === 'type') {
          return {
            ...error,
            message: 'Alpha values should be numbers (e.g., 1.0) not strings. This may indicate an older clock format.'
          };
        }
        return error;
      });

      return { errors: enhancedErrors };
    }
  } catch (e) {
    return {
      exception: e instanceof Error ? e.message : String(e),
    };
  }
};

export default parser;
