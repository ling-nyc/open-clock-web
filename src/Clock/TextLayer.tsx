import { CSSProperties, FunctionComponent, useEffect } from 'react';
import type { Property } from 'csstype';
import {
  ChronoField,
  DateTimeFormatter,
  TemporalField,
  ZonedDateTime,
} from '@js-joda/core';
// @ts-ignore
import { Locale } from '@js-joda/locale_en-us';
import { toWords } from 'number-to-words';

import { LayerProps } from './LayerProps';
import { useTime } from '../TimeContext';
import {
  ClockLayerDateTimeFormat as Format,
  ClockLayerTypeEnum,
  ClockLayerTextCasingEnum,
  ClockLayerTextJustificationEnum,
  ClockLayerDateTimeFormatEnum,
} from '../open-clock';
import { useFontCheck } from './useFontCheck';

interface DateTimeTextProps {
  dateTimeFormat?: Format;
}

type FormatFunction = (time: ZonedDateTime) => string;

const p = (pattern: string): FormatFunction => {
  const formatter = DateTimeFormatter.ofPattern(pattern).withLocale(Locale.US);
  return (time) => formatter.format(time);
};

const w =
  (unit: TemporalField, singular?: string, plural?: string): FormatFunction =>
  (time) => {
    const n = time.get(unit);
    const words = toWords(n);
    if (typeof singular === 'string' && typeof plural === 'string') {
      return `${words} ${n === 1 ? singular : plural}`;
    } else {
      return words;
    }
  };

const formatPatterns: Record<string, FormatFunction | string | undefined> = {
  [ClockLayerDateTimeFormatEnum.City]: undefined,
  [ClockLayerDateTimeFormatEnum.Colon]: ':',
  [ClockLayerDateTimeFormatEnum.Country]: undefined,
  [ClockLayerDateTimeFormatEnum.Da]: p('eee'),
  [ClockLayerDateTimeFormatEnum.Dadd]: p('eee d'),
  [ClockLayerDateTimeFormatEnum.Dd]: p('dd'),
  [ClockLayerDateTimeFormatEnum.Ddauto]: p('d'),
  [ClockLayerDateTimeFormatEnum.Ddmm]: p('d MMM'),
  [ClockLayerDateTimeFormatEnum.Dl]: p('EEEE'),
  [ClockLayerDateTimeFormatEnum.Dw]: p('E'),
  [ClockLayerDateTimeFormatEnum.Dy]: p('D'),
  [ClockLayerDateTimeFormatEnum.Hh]: p('hh'),
  [ClockLayerDateTimeFormatEnum.Hhmm]: p('h:mm'),
  [ClockLayerDateTimeFormatEnum.Hhmmpm]: p('h:mm a'),
  [ClockLayerDateTimeFormatEnum.Hhmmss]: p('h:mm:ss'),
  [ClockLayerDateTimeFormatEnum.HourWord]: w(ChronoField.HOUR_OF_AMPM),
  [ClockLayerDateTimeFormatEnum.HourWordUnit]: w(ChronoField.HOUR_OF_AMPM, 'hour', 'hours'),
  [ClockLayerDateTimeFormatEnum.Ml]: p('MMMM'),
  [ClockLayerDateTimeFormatEnum.Mm]: p('mm'),
  [ClockLayerDateTimeFormatEnum.Mmdd]: p('MMM d'),
  [ClockLayerDateTimeFormatEnum.Mn]: p('M'),
  [ClockLayerDateTimeFormatEnum.Mo]: p('MMM'),
  [ClockLayerDateTimeFormatEnum.MinuteWord]: w(ChronoField.MINUTE_OF_HOUR),
  [ClockLayerDateTimeFormatEnum.MinuteWordUnit]: w(ChronoField.MINUTE_OF_HOUR, 'minute', 'minutes'),
  [ClockLayerDateTimeFormatEnum.Pm]: p('a'),
  [ClockLayerDateTimeFormatEnum.Ss]: p('ss'),
  [ClockLayerDateTimeFormatEnum.SecondsWord]: w(ChronoField.SECOND_OF_MINUTE),
  [ClockLayerDateTimeFormatEnum.SecondsWordUnit]: w(
    ChronoField.SECOND_OF_MINUTE,
    'second',
    'seconds'
  ),
  [ClockLayerDateTimeFormatEnum.Slash]: '/',
  [ClockLayerDateTimeFormatEnum.Wy]: p('w'),
  [ClockLayerDateTimeFormatEnum.Yy]: p('yy'),
  [ClockLayerDateTimeFormatEnum.Yyyy]: p('yyyy'),
};

const textAnchors: Record<string, Property.TextAnchor> = {
  [ClockLayerTextJustificationEnum.Centered]: 'middle',
  [ClockLayerTextJustificationEnum.Left]: 'start',
  [ClockLayerTextJustificationEnum.Right]: 'end',
};

const textTransforms: Record<string, Property.TextTransform | undefined> = {
  [ClockLayerTextCasingEnum.Lower]: 'lowercase',
  [ClockLayerTextCasingEnum.None]: undefined,
  [ClockLayerTextCasingEnum.Sentence]: undefined, // not supported by CSS. ¯\_(ツ)_/¯
  [ClockLayerTextCasingEnum.Uppercased]: 'uppercase',
  [ClockLayerTextCasingEnum.Word]: 'capitalize',
};

const DateTimeText: FunctionComponent<DateTimeTextProps> = ({
  dateTimeFormat,
}) => {
  const now = useTime();
  if (!dateTimeFormat) {
    return null;
  }
  const pattern = formatPatterns[dateTimeFormat];
  if (pattern === undefined) {
    return null;
  } else if (typeof pattern === 'string') {
    return <>{pattern}</>;
  } else {
    return <>{pattern(now)}</>;
  }
};

/**
 * Render a text layer which may display static or formatted date/time text.
 *
 * @param position - Calculated x/y position of the text.
 * @param layer - The clock layer configuration.
 * @param onMissingFont - Optional callback to report missing fonts.
 */
const TextLayer: FunctionComponent<LayerProps> = ({
  position: { x, y },
  layer,
  onMissingFont,
}) => {
  if (!layer.textOptions) {
    return null;
  }

  const fontFamily = layer.textOptions.fontFamily;
  const { isLoaded, errorMessage } = useFontCheck(fontFamily);

  // Report missing font to the parent component
  useEffect(() => {
    if (
      !isLoaded &&
      errorMessage &&
      fontFamily &&
      fontFamily.trim() !== '' &&
      onMissingFont
    ) {
      console.log(`Detected missing font: "${fontFamily}"`);
      onMissingFont(fontFamily);
    }
  }, [isLoaded, errorMessage, fontFamily, onMissingFont]);

  const style: CSSProperties = {
    textTransform: textTransforms[layer.textOptions.casingType || ClockLayerTextCasingEnum.None],
    fontFamily:
      !isLoaded && errorMessage ? 'sans-serif' : fontFamily || 'sans-serif',
    fontSize: `${Number(layer.scale) * 46.5}px`,
    textAnchor: textAnchors[layer.textOptions.justification || ClockLayerTextJustificationEnum.Centered] || textAnchors[ClockLayerTextJustificationEnum.Centered],
    fill: layer.fillColor,
  };

  return (
    <text x={x} y={y} style={style}>
      {layer.type === ClockLayerTypeEnum.DateTime ? (
        <DateTimeText dateTimeFormat={layer.textOptions.dateTimeFormat} />
      ) : (
        layer.textOptions.customText
      )}
    </text>
  );
};

export default TextLayer;