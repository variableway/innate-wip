# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: javascript
# Normalized: js
# Block index: 6

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import axios from 'axios';

// Familiar packages work as expected
const api = axios.create({ baseURL: 'https://api.example.com' });

const App = () => (
  <Provider store={store}>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </Provider>
);