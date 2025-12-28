import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AdminLayout() {

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
        name="dashboard"
        options={{
          title: 'Admin Dashboard',
          headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Admin Login',
          headerShown: false
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
