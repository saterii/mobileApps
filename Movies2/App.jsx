import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MovieListScreen from './MovieListScreen';
import MovieDetailScreen from './MovieDetailScreen';
import MovieVideoScreen from "./MovieVideoScreen"

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MoviesList"
          component={MovieListScreen}
          options={{ title: "Sampsa's Movielist" }}
        />
        <Stack.Screen 
          name="MovieDetails" 
          component={MovieDetailScreen} 
          options={{ title: 'Movie details' }}
        />
        <Stack.Screen 
          name="MovieVideo" 
          component={MovieVideoScreen} 
          options={{ title: 'Video' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;