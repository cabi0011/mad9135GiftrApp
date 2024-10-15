import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Button, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FAB } from 'react-native-paper';
import PeopleContext from "../PeopleContext";
import { MaterialIcons } from '@expo/vector-icons';

export default function IdeaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { getIdeasForPerson, deleteIdea } = useContext(PeopleContext);
  const [ideas, setIdeas] = useState([]);
  const [personName, setPersonName] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      const ideasForPerson = await getIdeasForPerson(id);
      setIdeas(ideasForPerson.ideas);
      setPersonName(ideasForPerson.name);
    };
    fetchIdeas();
  }, [id]);

  const handleDelete = async (ideaId) => {
    await deleteIdea(id, ideaId);
    const updatedIdeas = await getIdeasForPerson(id);
    setIdeas(updatedIdeas.ideas);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.heading}>{personName}'s Gift Ideas</Text>
      {ideas.length === 0 ? (
        <Text>No ideas yet. Add your first idea!</Text>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ideaItem}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <Text style={styles.ideaText}>{item.text}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("AddIdeaScreen", { id })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ideaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  ideaText: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});