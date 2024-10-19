import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Dimensions, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Camera, CameraView } from 'expo-camera';
import { Button, Input, Card } from 'react-native-elements';
import PeopleContext from "../PeopleContext"; 
import CustomModal from "../components/customModal";

export default function AddIdeaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { addIdea } = useContext(PeopleContext);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const cameraRef = useRef(null);
  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  const imageHeight = imageWidth * aspectRatio;

 

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const pictureSizes = await cameraRef.current.getAvailablePictureSizesAsync('4:3');
      if (pictureSizes && pictureSizes.length > 0) {
        options.pictureSize = pictureSizes[0];
      }
      const photo = await cameraRef.current.takePictureAsync(options);
      setImage(photo.uri);
    }
  };

  const handleSaveIdea = async () => {
    if (!text || !image) {
      setModalMessage("Please provide both text and an image.");
      setModalVisible(true);
      return;
    }
    try {
      await addIdea(id, { text, image, width: imageWidth, height: imageHeight });
      navigation.navigate("People", { id });
    } catch (error) {
      setModalMessage("Failed to save idea. Please try again.");
      setModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Card>
          <Card.Title>Add New Idea</Card.Title>
          <Card.Divider />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Input placeholder="Idea Text" value={text} onChangeText={setText} />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: imageWidth, height: imageHeight }} />
            ) : (
              <>
                {hasPermission === null ? (
                  <Text>Requesting camera permission...</Text>
                ) : hasPermission === false ? (
                  <Text>No access to camera</Text>
                ) : (
                  // <CameraView style={{ width: imageWidth, height: imageHeight }} ref={cameraRef}>
                  // <CameraView style={styles.camera} ref={cameraRef}>
                  <CameraView style={{ width: imageWidth, height: imageHeight }} ref={cameraRef}>  
                    <Button title="Take Picture" onPress={takePicture} />
                  </CameraView>
                )}
              </>
            )}
          </KeyboardAvoidingView>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Button title="Save" onPress={handleSaveIdea} />
            <Button title="Cancel" onPress={() => navigation.navigate("People", { id })} />
          </KeyboardAvoidingView>
        </Card>
      </View>
      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
});