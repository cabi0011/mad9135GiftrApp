import React from "react";
import { Button } from "react-native";
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
          <Stack.Screen 
            name="People" 
            component={PeopleScreen} 
            options={({ navigation }) => ({
              title: 'People',
              headerRight: () => (
                <Button
                  title="Add Person"
                  onPress={() => navigation.navigate("AddPerson")}
                />
              ),
            })}
          />
          <Stack.Screen name="AddPerson" component={AddPersonScreen} />
          <Stack.Screen 
            name="IdeaScreen"
            component={IdeaScreen}
            options={({ navigation, route }) => ({
              title: `${route.params.name}'s Gift Ideas`,
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate("AddIdeaScreen", { id: route.params.id})}
                  title="Add Idea"
                  type="clear"
                />
              ),
            })} 
          
          /> 
          <Stack.Screen name="AddIdeaScreen" component={AddIdeaScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </PeopleProvider>
  );
}

