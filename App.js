import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,              // <--- Added
  PermissionsAndroid     // <--- Added
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { removeBackground } from '@six33/react-native-bg-removal';

const App = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Select Image (Camera or Gallery)
  const pickImage = async (type) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    };

    // Callback to handle the result
    const callback = (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert("Error", response.errorMessage || "Could not pick image");
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setOriginalImage(uri);
        setProcessedImage(null); // Reset previous result
      }
    };

    if (type === 'camera') {
      // ✅ FIX: Explicitly ask for Camera Permission on Android
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "Genrobe needs camera access to take product photos.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "Camera access is required to take photos.");
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }
      // Open Camera
      await launchCamera(options, callback);
    } else {
      // Open Gallery
      await launchImageLibrary(options, callback);
    }
  };

  // 2. Run Background Removal
  const handleRemoveBackground = async () => {
    if (!originalImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    setLoading(true);
    try {
      // The magic happens here
      const resultUri = await removeBackground(originalImage);
      setProcessedImage(resultUri);
    } catch (error) {
      const errString = error.toString();
      console.error(error);

      // ✅ FIX: Handle the "Downloading Model" error gracefully
      if (errString.includes("subject segmentation")) {
        Alert.alert(
          "Downloading AI Model", 
          "Google is downloading the AI brain. Please wait 1 minute and try again."
        );
      } else {
        Alert.alert("Failed", "Could not remove background. Try a simpler image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Genrobe BG Remover Test</Text>

      {/* Buttons Area */}
      <View style={styles.buttonRow}>
        <Button title="📸 Camera" onPress={() => pickImage('camera')} />
        <View style={{ width: 10 }} />
        <Button title="🖼️ Gallery" onPress={() => pickImage('gallery')} />
      </View>

      {/* Original Image Preview */}
      <Text style={styles.label}>Original:</Text>
      <View style={styles.imageContainer}>
        {originalImage ? (
          <Image source={{ uri: originalImage }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.placeholder}>No Image Selected</Text>
        )}
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={[styles.actionBtn, !originalImage && styles.disabledBtn]} 
        onPress={handleRemoveBackground}
        disabled={!originalImage || loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Processing..." : "Remove Background ✂️"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />}

      {/* Result Image Preview */}
      {processedImage && (
        <>
          <Text style={styles.label}>Result (Transparent):</Text>
          <View style={[styles.imageContainer, styles.checkeredBg]}>
            <Image source={{ uri: processedImage }} style={styles.image} resizeMode="contain" />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
    color: '#555',
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  checkeredBg: {
    backgroundColor: '#e0e0e0', 
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    color: '#aaa',
  },
  actionBtn: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#b0b0b0',
    elevation: 0,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;