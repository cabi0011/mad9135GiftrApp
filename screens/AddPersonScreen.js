import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { Button, Input, Card } from 'react-native-elements';
import { DatePicker } from 'react-native-modern-datepicker';
import PeopleContext from "../PeopleContext";
import CustomModal from "../components/customModal";

export default function AddPersonScreen() {
  const navigation = useNavigation();
  const { addPerson } = useContext(PeopleContext);
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const cameraRef = useRef(null);
  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  const imageHeight = imageWidth * aspectRatio;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleAddPerson = () => {
    if (!name || !dob) {
      setErrorModalVisible(true);
      return;
    }
    addPerson(name, dob.toISOString());
    navigation.navigate("People");
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Card>
          <Card.Title>Add New Person</Card.Title>
          <Card.Divider />
          <Input placeholder="Name" value={name} onChangeText={setName} />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Input placeholder="Date of Birth" value={dob.toDateString()} editable={false} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <Button title="Add Person" onPress={handleAddPerson} />
        </Card>
      </View>
      <CustomModal
        visible={errorModalVisible}
        type="error"
        message="Please fill in all fields."
        onClose={() => setErrorModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}