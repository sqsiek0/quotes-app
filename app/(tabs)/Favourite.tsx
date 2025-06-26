import { View, FlatList, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { useFavourites } from "../../hooks/useFavourites";
import { useTheme } from "../../hooks/useTheme";
import AppQuoteCard from "../../components/AppQuoteCard";
import { QuoteResponse } from "../../types/Quotes";
import { FavouriteModal } from "../../components/(tabs)/Favourities/FavouriteModal";

export default function Favourites() {
  const { state, toggle } = useFavourites();
  const [selected, setSelected] = useState<QuoteResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [colors, typo, _, mode] = useTheme();

  return (
    <View
      testID="favourites-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={state.ids.map((id) => state.byId[id])}
        keyExtractor={(item) => item.id.toString()}
        indicatorStyle={mode === "dark" ? "white" : "black"}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[typo.body, { color: colors.text }]}>
              No favourites yet.
            </Text>
          </View>
        )}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={{ padding: 16 }}
        renderItem={({ item }) => {
          return (
            <AppQuoteCard
              quote={item.quote}
              author={item.author}
              onPress={() => {
                setSelected(item);
                setModalVisible(true);
              }}
            ></AppQuoteCard>
          );
        }}
      ></FlatList>
      <FavouriteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selected={selected}
        toggle={toggle}
      ></FavouriteModal>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
