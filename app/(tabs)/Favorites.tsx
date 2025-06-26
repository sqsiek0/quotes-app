import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useFavourites } from "../../hooks/useFavourites";
import { useTheme } from "../../hooks/useTheme";
import AppQuoteCard from "../../components/AppQuoteCard";
import AppButton from "../../components/AppButton";
import { QuoteResponse } from "../../types/Quotes";

export default function Favorites() {
  const { state, toggle } = useFavourites();
  const [selected, setSelected] = useState<QuoteResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [colors, typo, _, mode] = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={state.ids.map((id) => state.byId[id])}
        keyExtractor={(item) => item.id.toString()}
        indicatorStyle={mode === "dark" ? "white" : "black"}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
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
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text style={[typo.heading]}>{selected?.quote}</Text>
            <Text
              style={[
                typo.small,
                { marginBottom: 20, marginTop: 8, textAlign: "right" },
              ]}
            >
              – {selected?.author}
            </Text>
            <View style={{ gap: 8 }}>
              <AppButton
                title={"Close"}
                onPress={() => setModalVisible(false)}
              ></AppButton>
              <AppButton
                title={"Remove from favourites"}
                isDisabled={!selected}
                style={!selected ? {} : { backgroundColor: colors.danger }}
                onPress={() => {
                  if (selected) toggle(selected);
                  setModalVisible(false);
                }}
              ></AppButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 20,
    // justifyContent: "center",
  },
});
