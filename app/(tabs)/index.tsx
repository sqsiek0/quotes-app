import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../../hooks/ThemeProvider";
import AppButton from "../../components/AppButton";
import { useRandomQuote } from "../../hooks/quotes/useRandomQuote";

export default function HomeScreen() {
  const placeholderQuote = {
    text: "This is a placeholder quote.",
    author: "Author Name",
  };

  const [color, typo] = useTheme();
  const { data, isFetching, isLoading, isError, error, refetch } =
    useRandomQuote();

  function quoteView() {
    if (isError) {
      return (
        <View>
          <Text style={typo.heading}>Error: {error.message}</Text>
        </View>
      );
    }
    if (data) {
      return (
        <>
          <View style={styles.quoteContainer}>
            <Text style={typo.heading}>{data?.quote}</Text>
          </View>
          <View style={styles.authorContainer}>
            <Text style={[typo.small, { fontSize: 18 }]}>
              - {data?.author || placeholderQuote.author}
            </Text>
          </View>
        </>
      );
    }
  }

  function handleInitialLoad() {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return quoteView();
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      {handleInitialLoad()}
      {!isLoading && (
        <View style={styles.buttonRow}>
          <AppButton title={"New quote"} onPress={refetch}></AppButton>
          <AppButton title={"Add to favourite"}></AppButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  quoteContainer: {
    marginBottom: 10,
    alignItems: "flex-start",
  },
  authorContainer: {
    alignItems: "flex-end",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  loaderContainer: {
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
