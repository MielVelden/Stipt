import { View, Text, StyleSheet } from "react-native"

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text>Evenementen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
})
