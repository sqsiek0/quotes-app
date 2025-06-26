import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppQuoteCard from "../../components/AppQuoteCard";
import { useListQuotes } from "../../hooks/quotes/useListQuotes";
import { QuotesLoadingView } from "../../components/(tabs)/Quotes/QuotesLoadingView";
import { QuotesFailedView } from "../../components/(tabs)/Quotes/QuotesFailedView";

export default function Quotes() {
  const { search } = useLocalSearchParams<{
    search?: string;
  }>();

  const [colors, typo, _, mode] = useTheme();
  const {
    data,
    refetch,
    isLoading,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
  } = useListQuotes();

  const [refreshing, setRefreshing] = useState(false);

  const filteredQuotes = useMemo(() => {
    const allQuotes = data?.pages.flatMap((page) => page.quotes) || [];

    if (!search || search.trim() === "") {
      return allQuotes;
    }

    const searchTerm = search.toLowerCase().trim();
    return allQuotes.filter(
      (quote) =>
        quote.quote.toLowerCase().includes(searchTerm) ||
        quote.author.toLowerCase().includes(searchTerm),
    );
  }, [data, search]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 500);
  }, [refetch]);

  function renderContent() {
    if (isLoading) {
      return <QuotesLoadingView />;
    }

    if (isError) {
      return (
        <QuotesFailedView
          error={error}
          refetch={refetch}
          isRefetching={isRefetching}
        />
      );
    }

    return handleSuccess();
  }

  function handleSuccess() {
    return (
      <FlatList
        testID="quotes-list"
        data={filteredQuotes}
        keyExtractor={(item) => item.id.toString()}
        indicatorStyle={mode === "dark" ? "white" : "black"}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        refreshControl={
          <RefreshControl
            testID="quotes-refresh-control"
            refreshing={isRefetching || refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListFooterComponentStyle={{
          padding: 16,
          alignItems: "center",
        }}
        style={{ padding: 16 }}
        renderItem={({ item }) => {
          return <AppQuoteCard quote={item.quote} author={item.author} />;
        }}
      />
    );
  }

  function ListFooterComponent() {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer} testID="quotes-list-footer">
          <ActivityIndicator />
          <Text
            style={[
              typo.body,
              { color: colors.text, marginTop: 4, textAlign: "center" },
            ]}
          >
            Loading more...
          </Text>
        </View>
      );
    }
    return null;
  }

  function ListEmptyComponent() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[typo.body, { color: colors.text }]}>No quotes found</Text>
      </View>
    );
  }

  return (
    <View
      testID="quotes-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
  retryButton: {
    marginTop: 16,
    alignSelf: "center",
    padding: 8,
    borderRadius: 4,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
