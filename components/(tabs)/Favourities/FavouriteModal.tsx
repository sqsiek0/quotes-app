import { Modal, StyleSheet, View, Text } from "react-native";
import AppButton from "../../AppButton";
import { QuoteResponse } from "../../../types/Quotes";
import { useTheme } from "../../../hooks/useTheme";

type FavouriteModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selected: QuoteResponse | null;
  toggle: (quote: QuoteResponse) => void;
};

export function FavouriteModal({
  modalVisible,
  setModalVisible,
  selected,
  toggle,
}: FavouriteModalProps) {
  const [colors, typo] = useTheme();

  return (
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
  );
}

const styles = StyleSheet.create({
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
