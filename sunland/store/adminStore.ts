import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AdminStore {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  user: null,
  isAdmin: false,
  isLoading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        set({
          user: session.user,
          isAdmin: !!data,
          isLoading: false
        });

        if (data) {
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id);
        }
      } else {
        set({ user: null, isAdmin: false, isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
      set({ user: null, isAdmin: false, isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!adminData) {
          await supabase.auth.signOut();
          return { success: false, error: 'You do not have admin access' };
        }

        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        set({ user: data.user, isAdmin: true });
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: 'An error occurred during sign in' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAdmin: false });
  },

  checkAdminStatus: async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      set({ user, isAdmin: !!data });
    } else {
      set({ user: null, isAdmin: false });
    }
  },
}));
