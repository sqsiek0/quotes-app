import { View, Text, StyleSheet } from "react-native";
import AppButton from "../../AppButton";
import { useTheme } from "../../../hooks/ThemeProvider";

type QuotesLoadingViewProps = {
  error?: Error;
  refetch: () => void;
  isRefetching: boolean;
};

export function QuotesFailedView({
  error,
  refetch,
  isRefetching,
}: QuotesLoadingViewProps) {
  const [colors, typo] = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typo.body, { color: colors.danger, textAlign: "center" }]}>
        Error: {error?.message}
      </Text>
      <AppButton
        title={"Try again"}
        onPress={refetch}
        isLoading={isRefetching}
        style={styles.button}
      ></AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    width: "50%",
  },
});
