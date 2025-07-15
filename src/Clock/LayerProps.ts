import { ClockLayer } from '../open-clock';

export interface ImageAsset {
  width: number;
  height: number;
  url: string;
}

export type Assets = {
  [filename: string]: ImageAsset;
};

export interface LayerProps {
  layer: ClockLayer;
  position: {
    x: number;
    y: number;
  };
  assets: Assets;
  onMissingFont?: (name: string) => void;
}
