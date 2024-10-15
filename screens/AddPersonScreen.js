import React, { useContext, useState } from "react";
import { View, TextInput, Button, Modal, Text, KeyboardAvoidingView, Platform } from "react-native";
import PeopleContext from "../PeopleContext";
import { useNavigation } from "@react-navigation/native";
import { DatePicker } from 'react-native-modern-datepicker';

export default function AddPersonScreen() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const { addPerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const savePerson = () => {
    if (name && dob) {
      try {
        addPerson(name, dob);
        navigation.goBack();
      } catch (e) {
        setError("Failed to save person. Please try again.");
      }
    } else {
      setError("Name and date of birth are required.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 20, borderBottomWidth: 1, width: 200 }}
        />
        <DatePicker
          mode="calendar"
          onDateChange={setDob}
          selected={dob}
          style={{ marginBottom: 20, width: 200 }}
        />
        <Button title="Save" onPress={savePerson} />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
      <Modal
        visible={!!error}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setError("")}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text>{error}</Text>
            <Button title="Close" onPress={() => setError("")} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}