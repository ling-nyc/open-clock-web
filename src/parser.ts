import { validate, Schema, ValidationError } from 'jtd';
import { ClockWrapper } from './open-clock';
import schema from '../schemas/ClockWrapper.jtd.json';

export interface ClockParseResult {
  clock: ClockWrapper;
}

export type ParseResult =
  | ClockParseResult
  | { errors: readonly ValidationError[] }
  | { exception: string };

/**
 * Parse a clock JSON string and validate it against the schema.
 *
 * @param json - Raw JSON string representing a clock.
 * @returns Parsed clock wrapper or validation errors/exception info.
 */
const parser = (json: string): ParseResult => {
  try {
    const clock = JSON.parse(json);
    const errors = validate(schema as Schema, clock);
    if (errors.length === 0) {
      return { clock };
    } else {
      return { errors };
    }
  } catch (e) {
    return {
      exception: e instanceof Error ? e.message : String(e),
    };
  }
};

export default parser;
