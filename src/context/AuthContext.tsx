"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Admin = {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  role_description: string;
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

  const fetchAdmin = async () => {
    const { data, error } = await supabase.rpc("get_current_admin");

    if (error) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    const adminData = data && data.length > 0 ? data[0] : null;
    setAdmin(adminData);
    setLoading(false);
  };

useEffect(() => {
  const init = async () => {
    // ⏳ small delay fixes hydration issue
    await new Promise((res) => setTimeout(res, 100));

    const { data } = await supabase.auth.getSession();

    if (data.session) {
      fetchAdmin();
    } else {
      setLoading(false);
    }
  };

  init();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) fetchAdmin();
    else {
      setAdmin(null);
      setLoading(false);
    }
  });

  return () => subscription.unsubscribe();
}, []);

  return (
    <AuthContext.Provider value={{ admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);