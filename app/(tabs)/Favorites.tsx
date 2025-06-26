import { View, Text, FlatList } from "react-native";
import { useFavourites } from "../../hooks/useFavourites";
import { useTheme } from "../../hooks/useTheme";
import AppQuoteCard from "../../components/AppQuoteCard";

export default function Favorites() {
  const { state } = useFavourites();
  const [colors, typo, _, mode] = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
      }}
    >
      <FlatList
        data={state.ids.map((id) => state.byId[id])}
        keyExtractor={(item) => item.id.toString()}
        indicatorStyle={mode === "dark" ? "white" : "black"}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        style={{ padding: 16 }}
        renderItem={({ item }) => {
          return (
            <AppQuoteCard
              quote={item.quote}
              author={item.author}
              onPress={() => {}}
            ></AppQuoteCard>
          );
        }}
      ></FlatList>
    </View>
  );
}
