import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface AssetWarning {
  type: 'image' | 'font';
  name: string;
}

interface AssetWarningContextType {
  warnings: AssetWarning[];
  addWarning: (warning: AssetWarning) => void;
  clearWarnings: () => void;
}

const AssetWarningContext = createContext<AssetWarningContextType>({
  warnings: [],
  addWarning: () => {},
  clearWarnings: () => {},
});

export const useAssetWarnings = () => useContext(AssetWarningContext);

export const AssetWarningProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [warnings, setWarnings] = useState<AssetWarning[]>([]);

  const addWarning = useCallback((warning: AssetWarning) => {
    setWarnings((prev) => {
      // Don't add duplicate warnings
      const exists = prev.some(
        (w) => w.type === warning.type && w.name === warning.name
      );
      if (exists) return prev;
      return [...prev, warning];
    });
  }, []);

  const clearWarnings = useCallback(() => {
    setWarnings([]);
  }, []);

  return (
    <AssetWarningContext.Provider
      value={{ warnings, addWarning, clearWarnings }}
    >
      {children}
    </AssetWarningContext.Provider>
  );
};
