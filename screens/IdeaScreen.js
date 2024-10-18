import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Card, FAB, Image } from 'react-native-elements';
import PeopleContext from "../PeopleContext";

const IdeaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { people, getIdeasForPerson, removeIdea } = useContext(PeopleContext);
  const [ideas, setIdeas] = useState([]);
  const person = people.find(p => p.id === id);
  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.2; // 20% of screen width
  const imageHeight = imageWidth * aspectRatio;

  useEffect(() => {
    const fetchIdeas = async () => {
      const ideasList = await getIdeasForPerson(id);
      setIdeas(ideasList);
    };
    fetchIdeas();
  }, [id, ideas]);

  const handleRemoveIdea = async (ideaId) => {
    try {
      await removeIdea(id, ideaId);
      const updatedIdeas = await getIdeasForPerson(id);
      setIdeas(updatedIdeas);
    } catch (error) {
      Alert.alert("Error", "Failed to remove idea. Please try again.");
    }
  };

  const renderIdea = ({ item }) => (
    // console.log(item, "Checking items here" )
    <Card containerStyle={styles.card}>
      <View style={styles.ideaContainer}>
        <Image source={{ uri: item.image }} style={{ width: imageWidth, height: imageHeight }} />
        <Text style={styles.ideaText}>{item.text}</Text>
        <Button
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
      <FAB
        style={styles.fab}
        icon={{ name: 'add', color: 'white' }}
        onPress={() => navigation.navigate("AddIdeaScreen", { id })}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default IdeaScreen;