import React from 'react';
import View from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function MovieVideoScreen(props){
    const { route } = props;
    return(<View>
        <YoutubePlayer
          height={300}
          play={true}
          videoId={route.params.key}
        />
      </View>)
  }