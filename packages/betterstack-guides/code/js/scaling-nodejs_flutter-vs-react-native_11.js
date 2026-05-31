# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: dart
# Normalized: js
# Block index: 11

class CameraComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Camera(
      // Same component works everywhere
      onImageCaptured: handleImageCapture,
      quality: CameraQuality.high,
    );
  }
}