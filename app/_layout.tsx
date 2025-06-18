import { Stack } from "expo-router";
import { ThemeProvider } from "../hooks/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../services/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
