
import React, {useState, useEffect} from 'react';
import  Dialog  from "react-native-dialog"
import { View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import useAxios from 'axios-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, Card, Text, Image } from 'react-native-elements';
 
const WeatherForecast = (params) => {
  const city = params.city;
  const API_KEY = ""
  const URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=`;
  const [{ data, loading, error }, refetch] = useAxios(
    URL+city.name+'&appid='+API_KEY+'&units=metric'
  )
  const refreshForecast = () => {
    refetch();
  }
  const deleteCity = () => {
    params.deleteCity(city.id);
  }
  if (loading) return (
    <Card>
      <Card.Title>Loading....</Card.Title>
    </Card>
  )
  if (error) return (
    <Card>
      <Card.Title>Error loading weather forecast!</Card.Title>
    </Card>
  )
  let feelslikeicon = "https:" + data.current.condition.icon
  return (
    <Card>
      <Card.Title>{data.location.name} - {data.current.last_updated}</Card.Title>
      <Text>Temp: {data.current.temp_c}°c</Text>
      <Text>Feels like: {data.current.feelslike_c}°c</Text>
      <Text>Condition: {data.current.condition.text}</Text>
      <Text>Wind (Direction): {data.current.wind_kph}km/h ({data.current.wind_dir})</Text>
      <Text>Humidity: {data.current.humidity}%</Text>
      <Image source={{uri:feelslikeicon}} containerStyle={styles.weather}/>
      <View containerStyle={styles.options}>
      <Text onPress={refreshForecast}>Refresh</Text>
      <Text onPress={deleteCity}>Delete</Text>
      </View>
    </Card>
  );
}

const App = () => {
  
  const [modalVisible, setModalVisible] = useState(false); 
  const [cityName, setCityName] = useState(""); 
  const [cities, setCities] = useState([]);
  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(cities));
    } catch (e) {
      console.log(e);
    }
  }
  
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities')
      if(value !== null) {
        setCities(JSON.parse(value));
      }
    } catch(e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getData();
  },[]);
  useEffect(() => {
    storeData();
  },[cities]); 
  const openDialog = () => {
    setModalVisible(true);
  }
  const addCity = () => {
    setCities( [...cities,{id:Math.random(), name:cityName}]);
    setModalVisible(false);
    
    
  }
  const cancelCity = () =>{
    setModalVisible(false);
  }
  
  const deleteCity = (deleteCity) => {
    let filteredArray = cities.filter(city => city.id !== deleteCity);
    setCities(filteredArray);
  }
  
  return (
    <SafeAreaView>
      <TouchableOpacity>
     <Header
      centerComponent={{ text: 'Weather App', style: { color: '#fff', fontSize: 20 } }}
      rightComponent={{ icon: "add", color: '#fff', onPress: openDialog }}
    />
    </TouchableOpacity>
    
    <ScrollView>
      {cities.map(city => (
        <WeatherForecast key={city.id} city={city} deleteCity={deleteCity} />
      ))}
        <Image source={{uri:"https://cdn.weatherapi.com/v4/images/weatherapi_logo.png"}} containerStyle={styles.logo}/>
    </ScrollView>
    <View></View>
    
    
    <Dialog.Container visible={modalVisible}>
    <Dialog.Title>Add a new city</Dialog.Title>
    <Dialog.Input onChangeText={(text)=>setCityName(text)} placeholder='Type city name here'></Dialog.Input>
    <Dialog.Button label="Cancel" onPress={cancelCity} />
    <Dialog.Button label="Add" onPress={addCity} />
    
  </Dialog.Container>
    </SafeAreaView>
    
    
  );
};
const styles = StyleSheet.create({

  logo: {
    aspectRatio: 107 / 50,
    width: '30%',
    
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 90,
  },
  weather: {
    aspectRatio: 1,
    width: '30%',
    alignSelf: "center",
    marginTop: 15,
    
  },
  
  });

export default App;