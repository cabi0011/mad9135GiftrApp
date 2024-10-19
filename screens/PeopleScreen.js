import React, { useContext } from "react";
import { View, FlatList, StyleSheet, Alert, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Text, Button, FAB, Icon } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import PeopleContext from "../PeopleContext";

const PeopleScreen = () => {
  const { people, setPeople, removePerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const handleRemovePerson = async (id) => {
    try {
      await removePerson(id);
      
    } catch (error) {
      Alert.alert("Error", "Failed to remove person. Please try again.");
    }
  };

  const renderRightActions = (id) => (
    <Button
      title="Delete"
      onPress={() => handleRemovePerson(id)}
      buttonStyle={styles.deleteButton}
    />
  );

  const renderPerson = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
          <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
          <Icon
            name="person"
            type="material"
            color="#517fa4"
            containerStyle={styles.icon}
          />
        </View>
        {/* <Card.Title>{item.name}</Card.Title>
        <Icon
          name="person"
          type="material"
          color="#517fa4"
          containerStyle={styles.icon}
        /> */}
        <Card.Divider />
        <Text>Birthday: {item.dob}</Text>
        <Button
          title="View Ideas"
          onPress={() => navigation.navigate("IdeaScreen", { id: item.id })}
          buttonStyle={styles.button}
        />
      </Card>
    </Swipeable>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'blue',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
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