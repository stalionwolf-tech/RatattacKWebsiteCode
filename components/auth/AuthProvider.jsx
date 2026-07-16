'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate current user from localStorage on mount + subscribe to changes
  useEffect(() => {
    setUser(auth.getCurrentUser());
    setLoading(false);
    const unsub = auth.subscribe((u) => setUser(u));
    // Cross-tab sync
    const onStorage = (e) => {
      if (e.key && (e.key.includes('ratattack_auth_') || e.key.includes('ratattack_mock_'))) {
        setUser(auth.getCurrentUser());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => { unsub(); window.removeEventListener('storage', onStorage); };
  }, []);

  const login    = useCallback(async (args) => { const r = await auth.login(args);    setUser(r.user); return r; }, []);
  const signup   = useCallback(async (args) => { const r = await auth.signup(args);   setUser(r.user); return r; }, []);
  const logout   = useCallback(async ()      => { await auth.logout();                 setUser(null);   }, []);
  const requestPasswordReset = useCallback(async (email) => auth.requestPasswordReset(email), []);
  const resetPassword       = useCallback(async (args) => { const r = await auth.resetPassword(args); setUser(r.user); return r; }, []);
  const updateProfile        = useCallback(async (patch) => { const r = await auth.updateProfile(patch); setUser(r.user); return r; }, []);
  const changePassword       = useCallback(async (args) => auth.changePassword(args), []);

  const value = useMemo(() => ({
    user, loading,
    isAuthenticated: !!user,
    providerMeta: auth.providerMeta,
    login, signup, logout,
    requestPasswordReset, resetPassword,
    updateProfile, changePassword,
  }), [user, loading, login, signup, logout, requestPasswordReset, resetPassword, updateProfile, changePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
