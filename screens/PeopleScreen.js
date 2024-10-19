import React, { useContext, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Text, Button, FAB, Icon } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import PeopleContext from "../PeopleContext";
import CustomModal from "../components/customModal";

const PeopleScreen = () => {
  const { people, setPeople, removePerson } = useContext(PeopleContext);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [idDeleted, setIdDeleted] = useState(null);

  const handleRemovePerson = async (id) => {
    setModalVisible(true);
    setIdDeleted(id);
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
    <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
          <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
          <Text>Birthday: {item.dob}</Text>
          </View>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate("IdeaScreen", { id: item.id, name: item.name })}>
            <Icon
              name="person"
              type="material"
              color="#517fa4"
              size={40} 
              containerStyle={styles.icon}
            />
          </TouchableOpacity>
        </View>
        </View>
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
            <CustomModal
        visible={modalVisible}
        message="Are you sure you want to delete this person?"
        onClose={() => setModalVisible(false)}
        onDelete={async () => {
          if (idDeleted) {
            await removePerson(idDeleted);
            setModalVisible(false);
            setIdDeleted(null);
          }
        }}
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
    flexDirection: 'column',
  },
  cardContent: {
   flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default PeopleScreen;