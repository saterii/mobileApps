/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Linking,
  Platform,
} from 'react-native';




function App() {
  const [ latitude, setLatitude ] = useState(0);
  const [ longitude, setLongitude] = useState(0);
  
  const launchMap = () => {
    const location = `${latitude},${longitude}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  }
  return (
    <SafeAreaView>
      <Text style={styles.headerText}>Open a map</Text>
      <TextInput  
        style={styles.input}
        placeholder='Latitude' 
        onChangeText={text => setLatitude(text)}/>
      <TextInput 
        style={styles.input}
        placeholder='Longitude' 
        onChangeText={text => setLongitude(text)}/>
      <View style={styles.button}>
      <Button title="Open map" onPress={launchMap}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "black",
    borderWidth: 1,
    margin: 5,
  },
  button: {
    padding: 5,
  },
  headerText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    marginTop: 60,
    marginBottom: 5,
  }
});

export default App;
