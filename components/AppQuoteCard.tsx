import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";

type AppQuoteCardProps = {
  quote: string;
  author: string;
  onPress?: () => void;
};

export default function AppQuoteCard({
  quote,
  author,
  onPress,
}: AppQuoteCardProps) {
  const [colors, typo] = useTheme();

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [pressed && onPress && { opacity: 0.5 }]}
    >
      <View
        style={[
          styles.itemContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text testID="quote-text" style={typo.headerBody}>
          {quote}
        </Text>
        <Text
          testID="quote-author"
          style={[
            typo.small,
            {
              textAlign: "right",
              marginTop: 8,
            },
          ]}
        >
          - {author}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});
