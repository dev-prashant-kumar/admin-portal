"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Admin = {
  name: string;
  role_id: string;
  email: string;
};

type AuthContextType = {
  admin: Admin | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inside your useEffect in AuthContext.tsx
async function fetchAdmin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    setLoading(false);
    return;
  }

  // Use RPC instead of .from() to bypass the recursive RLS policy
  const { data, error } = await supabase.rpc('get_current_admin');

  if (error) {
    console.error("Admin fetch error:", error);
    setLoading(false);
    return;
  }

  // RPC returns an array, so we grab the first item
  const adminData = data && data.length > 0 ? data[0] : null;

  setAdmin(adminData);
  setLoading(false);
}

    fetchAdmin();
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
