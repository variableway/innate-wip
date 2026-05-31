# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: javascript
# Normalized: js
# Block index: 2

// This can cause performance issues
const AnimatedList = ({ items }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true, // Critical for performance
    }).start();
  }, [items]);

  return (
    <Animated.View style={{ opacity: animatedValue }}>
      <FlatList data={items} renderItem={renderItem} />
    </Animated.View>
  );
};