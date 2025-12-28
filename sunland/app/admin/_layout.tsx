import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isClient, setIsClient] = useState(false);
  const { isAdmin, isLoading, initialize } = useAdminStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && Platform.OS === 'web') {
      initialize();
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || isLoading) return;

    const inAdminGroup = segments[0] === 'admin';
    const onLoginPage = segments[1] === 'login';

    if (!isAdmin && inAdminGroup && !onLoginPage) {
      router.replace('/admin/login');
    }
  }, [isClient, isAdmin, isLoading, segments]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Admin Login',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Admin Dashboard',
          headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="upload-track"
        options={{
          title: 'Upload Track',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="create-playlist"
        options={{
          title: 'Create Playlist',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="manage-content"
        options={{
          title: 'Manage Content',
          headerBackTitle: 'Back'
        }}
      />
    </Stack>
  );
}
