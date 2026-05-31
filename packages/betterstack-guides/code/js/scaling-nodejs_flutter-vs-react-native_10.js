# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: javascript
# Normalized: js
# Block index: 10

// This grows more complex over time
const CameraComponent = () => {
  if (Platform.OS === 'ios') {
    return <IOSCameraView />;
  }
  
  if (Platform.OS === 'android') {
    return <AndroidCameraView />;
  }
};