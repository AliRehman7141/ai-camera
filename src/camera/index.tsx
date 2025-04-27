import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import {
  Camera,
  useCameraDevice,
  CameraPermissionStatus,
  Frame,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated'; // Import runOnJS from react-native-reanimated

const Cameraa: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<CameraPermissionStatus>('not-determined');
  const device = useCameraDevice('back');

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status);
  };

  // This function processes the frame inside the worklet
  const processFrameInWorklet = (frame: Frame) => {
    'worklet'; // Marking this function as a worklet

    if (!frame.isValid) return;

    // Simulate frame processing or extracting data you need
    const processedData = {
      width: frame.width,
      height: frame.height,
      // You can add other logic here based on the frame data
    };

    // Send processed data to the JS thread for API call
    runOnJS(() => sendFrameToAPI(processedData)); // This will call the sendFrameToAPI function in the JS thread
  };

  // Function to send frame data to the API (on the JS thread)
  const sendFrameToAPI = async (processedData: any): Promise<void> => {
    try {
      const response = await fetch('https://0fd2-2400-adc1-190-3e00-d9a4-9509-3fd7-ac09.ngrok-free.app/process_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frame: processedData,
        }),
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  };

  // Using frameProcessor to process frames in worklet
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet'; // Make sure this is also marked as a worklet

    processFrameInWorklet(frame); // Pass frame to worklet for processing
  }, []);

  if (hasPermission === 'not-determined') {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (hasPermission === 'denied') {
    return <Text style={styles.errorText}>Camera permission denied</Text>;
  }

  return (
    <View style={styles.container}>
      {device ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={1} // Sends 1 frame per second
        />
      ) : (
        <Text style={styles.errorText}>No camera device found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20 },
});

export default Cameraa;
