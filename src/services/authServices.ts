import { supabase } from "@/lib/supabaseClient"

// SIGNUP
export const signupAdmin = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined // OTP mode
    }
  });
};

// VERIFY OTP
export const verifyOtpService = async (email: string, otp: string) => {
  return await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email"
  });
};

// LOGIN
export const loginAdmin = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const createAdmin = async (userId: string, email: string) => {
  return await supabase.from("admin_users").insert([
    {
      id: userId,
      email: email,
      role: "user"
    }
  ]);
};

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }

}

export async function getCurrentAdmin() {
  const { data } = await supabase.auth.getUser()
  return data.user
}