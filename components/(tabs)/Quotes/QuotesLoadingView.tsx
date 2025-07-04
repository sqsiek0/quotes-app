import { ActivityIndicator, StyleSheet, View } from "react-native";

export function QuotesLoadingView() {
  return (
    <View style={styles.container} testID="quotes-loading-view">
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
