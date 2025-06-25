import { Stack } from "expo-router";
import { ThemeProvider } from "../hooks/useTheme";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../services/queryClient";
import { StorageFavouritesProvider } from "../hooks/useFavourites";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StorageFavouritesProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </StorageFavouritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
