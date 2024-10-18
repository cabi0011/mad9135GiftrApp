import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { Button, Input, Card } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import PeopleContext from "../PeopleContext";

export default function AddPersonScreen() {
  const navigation = useNavigation();
  const { addPerson } = useContext(PeopleContext);
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  const imageHeight = imageWidth * aspectRatio;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleAddPerson = () => {
    addPerson(name, dob.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    navigation.navigate("People");
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the date picker after selecting a date
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Card>
          <Card.Title>Add New Person</Card.Title>
          <Card.Divider />
          <Input placeholder="Name" value={name} onChangeText={setName} />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Input
              placeholder="Date of Birth"
              value={dob.toISOString().split('T')[0]} // Display date as YYYY-MM-DD
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Button title="Add Person" onPress={handleAddPerson} />
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}