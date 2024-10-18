import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import PeopleScreen from "./screens/PeopleScreen";
import AddPersonScreen from "./screens/AddPersonScreen";
import IdeaScreen from "./screens/IdeaScreen"; // Import IdeaScreen
import AddIdeaScreen from "./screens/AddIdeaScreen"; // Import AddIdeaScreen
import { PeopleProvider } from "./PeopleContext"; 

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <PeopleProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="People">
          <Stack.Screen name="People" component={PeopleScreen} />
          <Stack.Screen name="AddPerson" component={AddPersonScreen} />
          <Stack.Screen name="IdeaScreen" component={IdeaScreen} /> 
          <Stack.Screen name="AddIdeaScreen" component={AddIdeaScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </PeopleProvider>
  );
}

