"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isEmployer: boolean;
  isSeeker: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, "signOut" | "isEmployer" | "isSeeker">>({
    user: null,
    session: null,
    profile: null,
    loading: true,
  });

  const fetchProfile = async (userId: string, session: Session) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setState({
        user: session.user,
        session: session,
        profile: data,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session);
      } else {
        setState((prev) => ({ ...prev, session: null, user: null, loading: false }));
      }
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Simpler: always fetch profile on auth change to avoid stale dependencies
        fetchProfile(session.user.id, session)
      } else {
        setState({ user: null, session: null, profile: null, loading: false })
      }
    })

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, session: null, profile: null, loading: false });
  };

  const value = {
    ...state,
    isEmployer: state.profile?.role === "employer",
    isSeeker: state.profile?.role === "seeker",
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
