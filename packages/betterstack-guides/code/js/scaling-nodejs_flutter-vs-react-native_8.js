# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: javascript
# Normalized: js
# Block index: 8

const UserAvatar = ({ user }) => (
  <View style={styles.container}>
    <Image 
      source={{ uri: user.avatar }}
      style={[
        styles.avatar,
        Platform.OS === 'ios' && styles.iosShadow
      ]}
    />
    {Platform.OS === 'android' && (
      <View style={styles.androidBorder} />
    )}
  </View>
);