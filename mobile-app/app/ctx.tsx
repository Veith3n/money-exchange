import React, { useState } from 'react';

import CurrencyExchangeApiService from '@/common/api/currency-exchange-api.service';

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: SessionDto | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

interface SessionDto {
  accessToken: string;
  email: string;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useState<SessionDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currencyExchangeApiService = CurrencyExchangeApiService.getInstance();

  const login = async (username: string, password: string) => {
    const response = await currencyExchangeApiService.login(username, password);

    setSession({ accessToken: response.accessToken, email: username });
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          setIsLoading(true);
          // Perform sign-in logic here
          await login(email, password);
          setIsLoading(false);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
