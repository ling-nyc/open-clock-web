// TypeScript interfaces for OpenClockStandard v0.9.6

export interface ClockWrapper {
  clockStandard: ClockStandard;
  assets?: ClockAsset[];
}

export interface ClockAsset {
  hasTransparency?: boolean;
  filename?: string;
  imageData?: string;
}

export interface ClockStandard {
  version?: number;
  title: string;
  canvas?: ClockCanvas;
  layers: ClockLayer[];
}

export interface ClockCanvas {
  width?: number;
  height?: number;
  type?: 'watchFace' | 'squareWidget' | 'wideWidget';
}

export interface ClockLayer {
  type: ClockLayerType;
  zIndex: number;
  customName?: string;
  filename?: string;
  imageFilename?: string; // Backward compatibility property
  fillColor?: string;
  alpha?: number;
  horizontalPosition?: number;
  verticalPosition?: number;
  scale?: number;
  angleOffset?: number;
  isHidden?: boolean;
  dataSource?: ClockLayerDataSource;
  textOptions?: ClockLayerTextOptions;
  iconOptions?: ClockLayerIconOptions;
  dataLabelOptions?: ClockLayerDataLabelOptions;
  weatherOptions?: ClockLayerWeatherOptions;
  handOptions?: ClockLayerHandOptions;
  dataBarOptions?: ClockLayerDataBarOptions;
  dataRingOptions?: ClockLayerDataRingOptions;
}

export type ClockLayerType = "dateTime" | "text" | "icon" | "dataLabel" | "image" | "hand" | "dataBar" | "dataRing";

export type ClockLayerDataSource = "Steps" | "StepCount" | "HeartRate" | "EnergyBurned" | "EnergyBurnedGoal" | "ExerciseTime" | "ExerciseTimeGoal" | "StandTime" | "StandTimeGoal" | "DistanceWalkRun" | "DistanceWalkRunUnit" | "FlightsClimbed" | "Temperature" | "TempertureMin" | "TempertureMax" | "Sunrise" | "Sunset" | "FeelsLike" | "ChanceOfPrecip" | "RainAmount" | "WeatherDescription" | "WeatherDescriptionCaps" | "WeatherIcon" | "WeatherDailyDayTemp" | "WeatherDailyNightTemp" | "WeatherDailyEveTemp" | "WeatherDailyMornTemp" | "Battery" | "BatteryNum" | "BatteryLevel";

export interface ClockLayerTextOptions {
  dateTimeFormatDescription?: string;
  fontFamily?: ClockLayerFontFamily;
  fontFilename?: string;
  customText?: string;
  effectType?: string;
  outlineWidth?: number;
  outlineColor?: string;
  kerning?: number;
  justification?: ClockLayerTextJustification;
  casingType?: ClockLayerTextCasing;
  dateTimeFormat?: ClockLayerDateTimeFormat;
}

export type ClockLayerFontFamily = "HelveticaNeue-Bold" | "RationalInteger" | "BlackRose" | "ConeriaScriptDemo" | "PlainGermanica" | "RothenburgDecorative" | "KingthingsFoundation" | "TrajanPro-Regular" | "DINPro-Light" | "UltraCondensedSerif" | "IronLounge2" | "Digital-7Mono" | "Digital-7MonoItalic" | "NixieOne" | "Lcdphone" | "Joystix" | "PixelMillennium" | "Cape_Corn" | "Bauhaus93" | "FuturaCondXBooldOblique" | "BenguiatBold" | "SF Mono" | "SFCompactDisplay-Regular" | "Impact" | "LIBRARY3AM" | "Trench-Thin" | "FontaniaRegular" | "28-SegmentLEDDisplay" | "AunchantedXspaceThin" | "BitstreamVeraSansMono-Roman" | "Street-Soul" | "Chinese-Brush" | "Code-Squared" | "Jeepers" | "KoolBeans" | "QuatreQuarts" | "Spacearella" | "Grinched" | "AshcanBB" | "Ballsontherampage" | "Unnamed-Regular" | "ManaspaceReg" | "TwoFiftySixBytes-Regular" | "NewsflashBB" | "AzonixRegular" | "CaviarDreams" | "OPTICopperplate" | "Roboto-Regular" | "SteelfishRg-Regular" | "BebasKai";

export type ClockLayerTextJustification = "left" | "right" | "centered";

export type ClockLayerTextCasing = "none" | "lower" | "sentence" | "uppercased" | "word";

export type ClockLayerDateTimeFormat = "HHMMSS" | "HHMM" | "HHMMPM" | "HH" | "MM" | "SS" | "PM" | "DADD" | "DDMM" | "MMDD" | "MO" | "ML" | "MN" | "DA" | "DD" | "DDAuto" | "DL" | "DY" | "DW" | "WY" | "YY" | "YYYY" | "Colon" | "Slash" | "City" | "Country" | "HourWord" | "MinuteWord" | "SecondsWord" | "HourWordUnit" | "MinuteWordUnit" | "SecondsWordUnit";

export interface ClockLayerHandOptions {
  useImage?: boolean;
  handType?: ClockLayerHandTypes;
  handStyle?: ClockLayerHandStyle;
  handStyleDescription?: string;
  animateClockwise?: boolean;
  imageAnchorX?: string;
  imageAnchorY?: string;
  imageFilename?: string;
}

export type ClockLayerHandStyle = "rounded" | "classicOutline" | "classic" | "swiss" | "swissCircle" | "flatDial" | "thinDial" | "blocky" | "arrow" | "roman" | "pie" | "pieInverted";

export type ClockLayerHandTypes = "second" | "minute" | "hour";

export interface ClockLayerDataLabelOptions {
  unitDisplayLevel?: "short" | "medium" | "long";
}

export interface ClockLayerIconOptions {
  [key: string]: any;
}

export interface ClockLayerWeatherOptions {
  timeSpan?: "current";
}

export interface ClockLayerDataRingOptions {
  format?: "energyBurned" | "exerciseTime" | "standTime" | "batteryLevel";
}

export interface ClockLayerDataBarOptions {
  [key: string]: any;
}

// Legacy enum exports for backward compatibility
export const ClockLayerTypeEnum = {
  DataBar: 'dataBar' as const,
  DataLabel: 'dataLabel' as const,
  DataRing: 'dataRing' as const,
  DateTime: 'dateTime' as const,
  Hand: 'hand' as const,
  Icon: 'icon' as const,
  Image: 'image' as const,
  Text: 'text' as const,
};

export const ClockLayerHandTypesEnum = {
  Hour: 'hour' as const,
  Minute: 'minute' as const,
  Second: 'second' as const,
};

export const ClockLayerTextCasingEnum = {
  Lower: 'lower' as const,
  None: 'none' as const,
  Sentence: 'sentence' as const,
  Uppercased: 'uppercased' as const,
  Word: 'word' as const,
};

export const ClockLayerTextJustificationEnum = {
  Centered: 'centered' as const,
  Left: 'left' as const,
  Right: 'right' as const,
};

export const ClockLayerDateTimeFormatEnum = {
  City: 'City' as const,
  Colon: 'Colon' as const,
  Country: 'Country' as const,
  Da: 'DA' as const,
  Dadd: 'DADD' as const,
  Dd: 'DD' as const,
  Ddauto: 'DDAuto' as const,
  Ddmm: 'DDMM' as const,
  Dl: 'DL' as const,
  Dw: 'DW' as const,
  Dy: 'DY' as const,
  Hh: 'HH' as const,
  Hhmm: 'HHMM' as const,
  Hhmmpm: 'HHMMPM' as const,
  Hhmmss: 'HHMMSS' as const,
  HourWord: 'HourWord' as const,
  HourWordUnit: 'HourWordUnit' as const,
  Ml: 'ML' as const,
  Mm: 'MM' as const,
  Mmdd: 'MMDD' as const,
  Mn: 'MN' as const,
  Mo: 'MO' as const,
  MinuteWord: 'MinuteWord' as const,
  MinuteWordUnit: 'MinuteWordUnit' as const,
  Pm: 'PM' as const,
  Ss: 'SS' as const,
  SecondsWord: 'SecondsWord' as const,
  SecondsWordUnit: 'SecondsWordUnit' as const,
  Slash: 'Slash' as const,
  Wy: 'WY' as const,
  Yy: 'YY' as const,
  Yyyy: 'YYYY' as const,
};