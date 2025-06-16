import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/ThemeProvider";

export default function HomeScreen() {
  const placeholderQuote = {
    text: "This is a placeholder quote.",
    author: "Author Name",
  };

  const [color, typo] = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.quoteContainer}>
        <Text style={typo.heading}>{placeholderQuote.text}</Text>
      </View>
      <View style={styles.authorContainer}>
        <Text style={[typo.small, { fontSize: 18 }]}>
          - {placeholderQuote.author}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Button 2</Text>
        </TouchableOpacity>
      </View>
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
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
