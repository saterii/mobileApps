import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
export default function MovieDetailScreen(props) {
  
  const { route } = props;
  const { movie } = route.params; 
  let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
  let imageurl = IMAGEPATH + movie.backdrop_path;
  let genrenames = []
  for (i in movie.additionalData.genres){
    if (i < (movie.additionalData.genres).length - 1){
      genrenames.push(movie.additionalData.genres[i].name + ", ")
    }else{
      genrenames.push(movie.additionalData.genres[i].name)
    }
  }

  let videos = []
  for (i in movie.additionalData.videos.results){
    videos.push([movie.additionalData.videos.results[i].name, movie.additionalData.videos.results[i].key])
  }
  
    const itemPressed = (index) => {
        //alert(index);
        props.navigation.navigate(
          'MovieVideo',
          { key: index });
      }

  return (
    
    <ScrollView>
      <Image source={{uri: imageurl}} style={styles.image}  />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.text}>{movie.release_date}</Text>
      <Text style={styles.text}>{movie.overview}</Text>
      <Text style={styles.text}>Genres: {genrenames}</Text>
      <Text style={styles.text}>Runtime: {movie.additionalData.runtime} minutes</Text>
      <Text style={styles.hyperlink} onPress={() => Linking.openURL(movie.additionalData.homepage)}>{movie.additionalData.homepage}</Text>
      <Text style={styles.text}>Videos: </Text>
      <View>
        {videos.map(info => <Text style={styles.hyperlink} onPress={_=> itemPressed(info[1])}>{info[0]}</Text>)}
      </View>
    </ScrollView>
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
  },
  hyperlink: {
    fontSize: 16,
    flexWrap: 'wrap',
    width: 370,
    margin: 10,
    color: "blue",
    textDecorationLine: "underline",
  }
});