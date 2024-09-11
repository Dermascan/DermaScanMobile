import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(243, 244, 246)',
        },
        headerShown: false,
      }}
    />
    
  );
}
