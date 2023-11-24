import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { FloatingAction } from 'react-native-floating-action';
import { Dialog } from 'react-native-simple-dialogs';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [city, setCity] = useState('');
  const [text, setText] = useState('');

  const openDialog = () => {
    setButtonVisible(false);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setButtonVisible(true);
    setDialogVisible(false);
  };
  const convertCityToCoords = async () => {
    try {
      const API_KEY = 'api key used to be here';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${API_KEY}`
      );
  
      if (response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          const newMarker = { latitude: lat, longitude: lng, title: city, subtitle: text };
          setMarkers([...markers, newMarker]);
          await _storeData(newMarker);
          closeDialog();
        }
      } else {
        console.error('Failed to convert city to coordinates');
      }
    } catch (error) {
      console.error('Error while converting city to coordinates:', error);
    }
  };
  
  const _storeData = async (value) => {
    try {
      const existingMarkers = await AsyncStorage.getItem('markers');
      const parsedMarkers = existingMarkers ? JSON.parse(existingMarkers) : [];
      const updatedMarkers = [...parsedMarkers, value];
      await AsyncStorage.setItem('markers', JSON.stringify(updatedMarkers));
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const getMarkers = async () => {
    try {
      const storedMarkers = await AsyncStorage.getItem('markers');
      if (storedMarkers) {
        const parsedMarkers = JSON.parse(storedMarkers);
        setMarkers(parsedMarkers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getMarkers();
  }, []);

  return (
    <SafeAreaView>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 62.24159,
          longitude: 25.75881,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.subtitle}
          />
        ))}
      </MapView>

      <Dialog
        titleStyle={styles.dialog}
        visible={dialogVisible}
        title="Add a new place"
        onTouchOutside={() => {
          closeDialog();
        }}
      >
        <View>
          <TextInput
            style={styles.input}
            label="City"
            onChangeText={(city) => setCity(city)}
          />
          <TextInput
            style={styles.input}
            label="Text"
            onChangeText={(text) => setText(text)}
          />
          <View style={styles.buttons}>
            <Button style={styles.cancel} onPress={closeDialog}>
              Cancel
            </Button>
            <Button style={styles.add} onPress={convertCityToCoords}>
              Add
            </Button>
          </View>
        </View>
      </Dialog>

      <FloatingAction
        onOpen={() => {
          openDialog();
        }}
        overlayColor="none"
        visible={buttonVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  dialog: {
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 4,
    fontSize: 20,
    color: 'gray',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default App;