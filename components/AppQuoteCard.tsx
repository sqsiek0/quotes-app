import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/ThemeProvider";

type AppQuoteCardProps = {
  quote: string;
  author: string;
};

export default function AppQuoteCard({ quote, author }: AppQuoteCardProps) {
  const [colors, typo] = useTheme();

  return (
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
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});
