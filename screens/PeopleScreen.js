import React, { useContext } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Text, Button, FAB } from 'react-native-elements';
import PeopleContext from "../PeopleContext";

const PeopleScreen = () => {
  const { people, setPeople } = useContext(PeopleContext);
  const navigation = useNavigation();

  const removePerson = (id) => {
    Alert.alert(
      "Remove Person",
      "Are you sure you want to remove this person?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            setPeople((prevPeople) => prevPeople.filter((person) => person.id !== id));
          }
        }
      ]
    );
  };

  const renderPerson = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{item.name}</Card.Title>
      <Card.Divider />
      <Text>Date of Birth: {item.dob}</Text>
      <Button
        title="View Ideas"
        onPress={() => navigation.navigate("IdeaScreen", { id: item.id })}
        buttonStyle={styles.button}
      />
      <Button
        title="Remove"
        onPress={() => removePerson(item.id)}
        buttonStyle={[styles.button, { backgroundColor: 'red' }]}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={renderPerson}
      />
      <FAB
        style={styles.fab}
        icon={{ name: 'add', color: 'white' }}
        onPress={() => navigation.navigate("AddPerson")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PeopleScreen;