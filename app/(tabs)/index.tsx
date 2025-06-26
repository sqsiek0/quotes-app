import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppButton from "../../components/AppButton";
import { useRandomQuote } from "../../hooks/quotes/useRandomQuote";
import { useFavourites } from "../../hooks/useFavourites";

export default function HomeScreen() {
  const [colorTheme, typo] = useTheme();
  const { data, isFetching, isLoading, isError, error, refetch } =
    useRandomQuote();
  const { toggle, isFavourite } = useFavourites();

  function handleInitialLoad() {
    return (
      <View style={styles.loaderContainer} testID="home-screen-initial-load">
        <ActivityIndicator />
      </View>
    );
  }

  function handleError() {
    return (
      <View style={styles.errorContainer} testID="home-screen-error">
        <Text
          style={[typo.body, { color: colorTheme.danger, textAlign: "center" }]}
        >
          Error: {error?.message}
        </Text>
        <View style={styles.errorButtonContainer}>
          <AppButton
            title={"Retry"}
            onPress={refetch}
            isLoading={isFetching}
          ></AppButton>
        </View>
      </View>
    );
  }

  function handleQuoteView() {
    return (
      <>
        <View style={styles.quoteContainer}>
          <Text style={typo.heading}>{data?.quote}</Text>
        </View>
        <View style={styles.authorContainer}>
          <Text style={[typo.small, { fontSize: 18 }]}>- {data?.author}</Text>
        </View>
        {renderButtonsRow()}
      </>
    );
  }

  function renderButtonsRow() {
    return (
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <AppButton
            title="New quote"
            onPress={refetch}
            isLoading={isFetching}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <AppButton
            title={
              data && isFavourite(data.id)
                ? "Remove from favs"
                : "Add to favourite"
            }
            isDisabled={isFetching}
            style={
              data && isFavourite(data.id)
                ? { backgroundColor: colorTheme.danger }
                : {}
            }
            onPress={() => {
              if (data) {
                toggle(data);
              }
            }}
          />
        </View>
      </View>
    );
  }

  function renderContent() {
    if (isLoading) {
      return handleInitialLoad();
    }
    if (isError) {
      return handleError();
    }
    if (data) {
      return handleQuoteView();
    }
    return null;
  }

  return (
    <View
      testID="home-screen-view"
      style={[styles.container, { backgroundColor: colorTheme.background }]}
    >
      {renderContent()}
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
    justifyContent: "space-between",
  },
  buttonWrapper: {
    flex: 1,
  },
  loaderContainer: {
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorButtonContainer: {
    marginTop: 20,
    width: "50%",
  },
});
