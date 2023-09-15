import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';

export default function MovieDetailScreen(props) {
  const { route } = props;
  const { movie } = route.params; 
  let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
  let imageurl = IMAGEPATH + movie.backdrop_path;

  return (
    <View>
      <Image source={{uri: imageurl}} style={styles.image}  />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.text}>{movie.release_date}</Text>
      <Text style={styles.text}>{movie.overview}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  image: {
    aspectRatio: 670/250
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    flexWrap: 'wrap',
    width: 370,
    margin: 10,
  }
});