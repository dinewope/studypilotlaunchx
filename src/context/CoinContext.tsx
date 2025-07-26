
'use client';

import * as React from 'react';

interface CoinContextType {
  coins: number;
  addCoins: (amount: number) => void;
}

const CoinContext = React.createContext<CoinContextType | undefined>(undefined);

export const CoinProvider = ({ children }: { children: React.ReactNode }) => {
  const [coins, setCoins] = React.useState<number>(0);

  const addCoins = (amount: number) => {
    setCoins(prevCoins => prevCoins + amount);
  };

  return (
    <CoinContext.Provider value={{ coins, addCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoins = () => {
  const context = React.useContext(CoinContext);
  if (context === undefined) {
    throw new Error('useCoins must be used within a CoinProvider');
  }
  return context;
};
