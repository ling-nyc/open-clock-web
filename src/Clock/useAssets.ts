import { useState, useEffect } from 'react';

/**
 * Convert embedded clock assets to object URLs that can be used in image
 * elements. Returned assets include image dimensions for convenience.
 */
import { decode } from 'base64-arraybuffer';
import { ClockAsset } from '../open-clock';
import type { Assets } from './LayerProps';
import { JpegData, readJpegHeader } from '../images/jpeg';
import { PngData, readPngHeader } from '../images/png';

const getDimensions = (
  imageData: ArrayBuffer
): JpegData | PngData | undefined => {
  const arr = new Uint8Array(imageData);

  const jpeg = readJpegHeader(arr);
  if (jpeg) {
    return jpeg;
  }

  const png = readPngHeader(arr);
  if (png) {
    return png;
  }

  return undefined;
};

/**
 * Convert raw clock assets to a map of image dimensions and blob URLs.
 *
 * @param clockAssets - Assets from the parsed clock file.
 * @returns Mapping from filename to decoded asset information.
 */
const clockAssetsToAssets = (clockAssets?: ClockAsset[]): Assets => {
  if (!clockAssets) {
    return {};
  } else {
    return Object.fromEntries(
      clockAssets.flatMap((asset) => {
        const buf = decode(asset.imageData || '');
        const dimensions = getDimensions(buf);
        if (dimensions) {
          return [
            [
              asset.filename,
              {
                ...dimensions,
                url: URL.createObjectURL(new Blob([buf])),
              },
            ],
          ];
        } else {
          return [];
        }
      })
    );
  }
};

/**
 * React hook that decodes and exposes assets for a clock.
 *
 * The returned assets are revoked automatically when the source list changes.
 *
 * @param clockAssets - Assets included with the clock JSON.
 * @returns Map of image filename to asset information.
 */
export const useAssets = (clockAssets?: ClockAsset[]): Assets => {
  const [assets, setAssets] = useState<Assets>({});

  useEffect(() => {
    const a = clockAssetsToAssets(clockAssets);
    setAssets(a);
    return () => {
      Object.values(a).forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [clockAssets]);

  return assets;
};
