import { View, Text, StyleSheet } from "react-native"

export default function SessionsScreen() {
  return (
    <View style={styles.container}>
      <Text>Sessies</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
})
