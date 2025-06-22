import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function Quotes() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  useEffect(() => {
    console.log("Quotes screen mounted with params:", search);
  }, [search]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Quotes Screen</Text>
      <Text testID="search-query">Search: {search}</Text>
    </View>
  );
}
