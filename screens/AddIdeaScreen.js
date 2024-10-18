import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Dimensions, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { Button, Input, Card } from 'react-native-elements';
import PeopleContext from "../PeopleContext"; 
import PeopleScreen from "./PeopleScreen";
import AddPersonScreen from "./AddPersonScreen";
import IdeaScreen from "./IdeaScreen"; 

export default function AddIdeaScreenComponent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { addIdea } = useContext(PeopleContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  const imageHeight = imageWidth * aspectRatio;

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, exif: false };
      const photo = await cameraRef.current.takePictureAsync(options);
      setImage(photo.uri);
    }
  };

  const saveIdea = () => {
    if (name && image) {
      addIdea(id, { name, image, width: imageWidth, height: imageHeight });
      navigation.navigate("IdeaScreen", { id });
    } else {
      alert("Both name and image are required.");
    }
  };

  const cancel = () => {
    navigation.navigate("IdeaScreen", { id });
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Input
          placeholder="Gift Idea Name"
          value={name}
          onChangeText={setName}
          containerStyle={{ marginBottom: 20, width: 200 }}
        />
        <Camera
          style={{ width: imageWidth, height: imageHeight }}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
        />
        <Button title="Take Picture" onPress={takePicture} containerStyle={{ marginVertical: 10 }} />
        {image && <Image source={{ uri: image }} style={{ width: imageWidth, height: imageHeight }} />}
        <Button title="Save" onPress={saveIdea} containerStyle={{ marginVertical: 10 }} />
        <Button title="Cancel" onPress={cancel} type="outline" containerStyle={{ marginVertical: 10 }} />
      </View>
    </KeyboardAvoidingView>
  );
}