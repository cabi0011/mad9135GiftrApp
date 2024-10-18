import React from 'react';
import { StyleSheet, View } from "react-native";
import { ThemeProvider } from 'react-native-elements';
import AppNavigator from "./AppNavigator";
import { PeopleProvider } from "./PeopleContext";

export default function App() {
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <PeopleProvider>
          <AppNavigator />
        </PeopleProvider>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});