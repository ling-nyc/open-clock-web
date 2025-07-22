import Ajv, { ErrorObject } from 'ajv';
import { ClockWrapper } from './open-clock';
import schema from '../schemas/ClockWrapper.json';

export interface ClockParseResult {
  clock: ClockWrapper;
}

export type ParseResult =
  | ClockParseResult
  | { errors: readonly ErrorObject[] }
  | { exception: string };

const ajv = new Ajv();
const validate = ajv.compile(schema);

/**
 * Parse a clock JSON string and validate it against the schema.
 *
 * @param json - Raw JSON string representing a clock.
 * @returns Parsed clock wrapper or validation errors/exception info.
 */
const parser = (json: string): ParseResult => {
  try {
    const clock = JSON.parse(json);
    const valid = validate(clock);
    if (valid) {
      return { clock: clock as unknown as ClockWrapper };
    } else {
      return { errors: validate.errors || [] };
    }
  } catch (e) {
    return {
      exception: e instanceof Error ? e.message : String(e),
    };
  }
};

export default parser;
