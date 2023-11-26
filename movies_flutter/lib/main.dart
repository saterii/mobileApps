import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MovieListItem {
  final int id;
  final String image;
  final String title;
  final String releaseDate;
  final String overview;

  const MovieListItem({
    required this.id,
    required this.image,
    required this.title,
    required this.releaseDate,
    required this.overview,
  });

  factory MovieListItem.fromJson(Map<String, dynamic> json) {
    var imageUrl = json["poster_path"] != null
        ? "http://image.tmdb.org/t/p/w500${json["poster_path"]}"
        : "";
    var id = json["id"] as int?;
    var parsedId = id?.toString() ?? '0';

    return MovieListItem(
      id: int.parse(parsedId),
      image: imageUrl,
      title: json["title"] as String,
      releaseDate: json["release_date"] as String,
      overview: json["overview"] as String,
    );
  }
}

class MovieItem {
  final String image;
  final String title;
  final String releaseDate;
  final String overview;
  final String genres;
  final String runTime;
  final List<List<String>> videos;

  const MovieItem({
    required this.image,
    required this.title,
    required this.releaseDate,
    required this.overview,
    required this.genres,
    required this.runTime,
    required this.videos,
  });

  factory MovieItem.fromJson(Map<String, dynamic> json) {
    var imageUrl = json["backdrop_path"] != null
        ? "http://image.tmdb.org/t/p/w500${json["backdrop_path"]}"
        : "";

    var genres = (json['genres'] as List<dynamic>)
        .map((genre) => genre['name'].toString())
        .toList()
        .cast<String>();

    var videos = (json['videos']['results'] as List<dynamic>)
        .map<List<String>>(
            (video) => [video['key'].toString(), video["name"].toString()])
        .toList();

    var genresString = genres.join(", ");
    return MovieItem(
      image: imageUrl,
      title: json["title"].toString(),
      releaseDate: json["release_date"].toString(),
      overview: json["overview"].toString(),
      genres: genresString,
      runTime: json["runtime"].toString(),
      videos: videos,
    );
  }

  static Future<MovieItem> fetchMovieDetails(int movieId) async {
    final response = await http.get(Uri.parse(
        'https://api.themoviedb.org/3/movie/$movieId?api_key=f7828d47c2dd6f3cc1d4475a4e9faaee&append_to_response=videos'));

    if (response.statusCode == 200) {
      final Map<String, dynamic> movieData = jsonDecode(response.body);
      return MovieItem.fromJson(movieData);
    } else {
      throw Exception('Failed to load movie details');
    }
  }
}

Future<List<MovieListItem>> fetchMovies(http.Client client) async {
  final response = await client.get(Uri.parse(
      'https://api.themoviedb.org/3/movie/now_playing?api_key=f7828d47c2dd6f3cc1d4475a4e9faaee'));
  return compute(parseMovies, response.body);
}

List<MovieListItem> parseMovies(String responseBody) {
  final parsed =
      jsonDecode(responseBody)["results"].cast<Map<String, dynamic>>();
  return parsed
      .map<MovieListItem>((json) => MovieListItem.fromJson(json))
      .toList();
}

class MoviesList extends StatelessWidget {
  const MoviesList({Key? key, required this.movies}) : super(key: key);
  final List<MovieListItem> movies;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: movies.length,
      itemBuilder: (context, index) {
        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) =>
                    MovieDetailScreen(movieItem: movies[index]),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 1,
                  child: Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8.0),
                      child: Image.network(
                        movies[index].image,
                        width: 100,
                        height: 150,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  flex: 3,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        movies[index].title,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(movies[index].releaseDate),
                      Text(
                        movies[index].overview,
                        maxLines: 5,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }
}

class VideoScreen extends StatelessWidget {
  final String videoKey;

  const VideoScreen({Key? key, required this.videoKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final YoutubePlayerController controller = YoutubePlayerController(
      initialVideoId: videoKey,
      flags: const YoutubePlayerFlags(
        autoPlay: true,
        mute: false,
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Video Player'),
      ),
      body: Center(
        child: YoutubePlayer(
          controller: controller,
          showVideoProgressIndicator: true,
          progressIndicatorColor: const Color.fromARGB(255, 255, 68, 68),
          progressColors: const ProgressBarColors(
            playedColor: Color.fromARGB(255, 243, 33, 33),
            handleColor: Color.fromARGB(255, 255, 68, 68),
          ),
        ),
      ),
    );
  }
}

class MovieDetailScreen extends StatelessWidget {
  final MovieListItem movieItem;

  const MovieDetailScreen({Key? key, required this.movieItem})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<MovieItem>(
      future: MovieItem.fetchMovieDetails(movieItem.id),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(
            appBar: AppBar(
              title: Text(movieItem.title),
            ),
            body: const Center(
              child: CircularProgressIndicator(),
            ),
          );
        } else if (snapshot.hasError) {
          return Scaffold(
            appBar: AppBar(
              title: Text(movieItem.title),
            ),
            body: const Center(
              child: Text('Error loading movie details'),
            ),
          );
        } else if (!snapshot.hasData) {
          return Scaffold(
            appBar: AppBar(
              title: Text(movieItem.title),
            ),
            body: const Center(
              child: Text('No data available'),
            ),
          );
        } else {
          final MovieItem movie = snapshot.data!;
          return Scaffold(
            appBar: AppBar(
              title: Text(movie.title),
            ),
            body: SingleChildScrollView(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Image.network(movie.image),
                  const SizedBox(height: 20),
                  Text(
                    'Title: ${movie.title}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Release Date: ${movie.releaseDate}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Genres: ${movie.genres}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Overview:',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    movie.overview,
                    style: const TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 20),
                  if (movie.videos.isNotEmpty)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Videos:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: movie.videos.length,
                          itemBuilder: (context, index) {
                            return ListTile(
                              title: Text(
                                movie.videos[index][1],
                                style: const TextStyle(
                                  color: Color.fromARGB(255, 65, 33, 243),
                                ),
                              ),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => VideoScreen(
                                      videoKey: movie.videos[index][0],
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      ],
                    ),
                ],
              ),
            ),
          );
        }
      },
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movies App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Movies Home Page'),
    );
  }
}

class MyHomePage extends StatelessWidget {
  final String title;

  const MyHomePage({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: FutureBuilder<List<MovieListItem>>(
        future: fetchMovies(http.Client()),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Center(
              child: Text("Error has occurred!"),
            );
          } else if (snapshot.hasData) {
            return MoviesList(movies: snapshot.data!);
          } else {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
        },
      ),
    );
  }
}
