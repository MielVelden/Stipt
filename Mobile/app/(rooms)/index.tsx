import { View, Text, StyleSheet } from "react-native"

export default function RoomsScreen() {
  return (
    <View style={styles.container}>
      <Text>Ruimtes</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
})
