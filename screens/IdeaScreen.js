import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button as ElementsButton, Card, Image } from 'react-native-elements';
import { Button as NativeButton } from "react-native"; 
import PeopleContext from "../PeopleContext";

const IdeaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { people, removeIdea } = useContext(PeopleContext);
  const [ideas, setIdeas] = useState([]);
  const person = people.find(p => p.id === id);
  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.2; // 20% of screen width
  const imageHeight = imageWidth * aspectRatio;

  useEffect(() => {
    if (person) {
      setIdeas(person.ideas);
    }
  }, [person]);

  const handleRemoveIdea = async (ideaId) => {
    try {
      await removeIdea(id, ideaId);
      const updatedIdeas = people.find((person) => person.id === id).ideas;
      setIdeas(updatedIdeas);
    } catch (error) {
      Alert.alert("Error", "Failed to remove idea. Please try again.");
    }
  };

  const renderIdea = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.ideaContainer}>
        <Image source={{ uri: item.image }} style={{ width: imageWidth, height: imageHeight }} />
        <Text style={styles.ideaText}>{item.text}</Text>
        <ElementsButton
          title="Delete"
          onPress={() => handleRemoveIdea(item.id)}
          buttonStyle={styles.deleteButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{person.name}'s Gift Ideas</Text>
      {ideas.length === 0 ? (
        <Text style={styles.emptyMessage}>No ideas yet. Add an idea!</Text>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderIdea}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
  },
  ideaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ideaText: {
    flex: 1,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});

export default IdeaScreen;