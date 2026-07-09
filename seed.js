const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Genre = require("./src/models/Genre");
const Movie = require("./src/models/Movie");
const TVShow = require("./src/models/TVShow");
const User = require("./src/models/User");

const genres = [
  { name: "Action" },
  { name: "Comedy" },
  { name: "Drama" },
  { name: "Horror" },
  { name: "Sci-Fi" },
  { name: "Thriller" },
  { name: "Romance" },
  { name: "Animation" },
  { name: "Documentary" },
  { name: "Family" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Genre.deleteMany({});
    await Movie.deleteMany({});
    await TVShow.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    const createdGenres = await Genre.insertMany(genres);
    const genreIds = createdGenres.map((g) => g._id);
    console.log(`Created ${createdGenres.length} genres`);

    await User.create({
      name: "Admin",
      email: "admin@netflix.com",
      password: "admin123",
      role: "admin",
    });
    await User.create({
      name: "John Doe",
      email: "john@netflix.com",
      password: "user123",
      role: "user",
    });
    console.log("Created admin and user accounts");

    const movies = [
      {
        title: "The Dark Knight",
        description:
          "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.",
        releaseYear: 2008,
        duration: 152,
        rating: 9.0,
        category: "action",
        maturityRating: "PG-13",
        isTrending: true,
        isPopular: true,
        isTopRated: true,
        genres: [genreIds[0], genreIds[2]],
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        director: "Christopher Nolan",
      },
      {
        title: "Inception",
        description:
          "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into a CEO's mind.",
        releaseYear: 2010,
        duration: 148,
        rating: 8.8,
        category: "sci-fi",
        maturityRating: "PG-13",
        isTrending: true,
        isTopRated: true,
        genres: [genreIds[4], genreIds[0]],
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        director: "Christopher Nolan",
      },
      {
        title: "The Conjuring",
        description:
          "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
        releaseYear: 2013,
        duration: 112,
        rating: 7.5,
        category: "horror",
        maturityRating: "R",
        isPopular: true,
        genres: [genreIds[3], genreIds[5]],
        cast: ["Patrick Wilson", "Vera Farmiga"],
        director: "James Wan",
      },
      {
        title: "The Hangover",
        description:
          "Three buddies wake up from a bachelor party in Las Vegas with no memory and the bachelor missing.",
        releaseYear: 2009,
        duration: 100,
        rating: 7.7,
        category: "comedy",
        maturityRating: "R",
        isPopular: true,
        genres: [genreIds[1]],
        cast: ["Zach Galifianakis", "Bradley Cooper", "Ed Helms"],
        director: "Todd Phillips",
      },
      {
        title: "Interstellar",
        description:
          "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
        releaseYear: 2014,
        duration: 169,
        rating: 8.6,
        category: "sci-fi",
        maturityRating: "PG-13",
        isTrending: true,
        isTopRated: true,
        genres: [genreIds[4], genreIds[2]],
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        director: "Christopher Nolan",
      },
      {
        title: "Toy Story 5",
        description:
          "Woody and Buzz go on a brand-new adventure with a set of new toys.",
        releaseYear: 2026,
        duration: 105,
        rating: 0,
        category: "animation",
        maturityRating: "G",
        isUpcoming: true,
        genres: [genreIds[7], genreIds[9]],
        cast: ["Tom Hanks", "Tim Allen"],
        director: "Andrew Stanton",
      },
      {
        title: "Avengers: Secret Wars",
        description:
          "The Avengers face their greatest threat yet in a multiverse-spanning battle.",
        releaseYear: 2027,
        duration: 180,
        rating: 0,
        category: "action",
        maturityRating: "PG-13",
        isUpcoming: true,
        genres: [genreIds[0], genreIds[4]],
        cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
        director: "Russo Brothers",
      },
      {
        title: "Forrest Gump",
        description:
          "The life journey of a man with a low IQ who accomplishes great things in his life and inspires those around him.",
        releaseYear: 1994,
        duration: 142,
        rating: 8.8,
        category: "drama",
        maturityRating: "PG-13",
        isTopRated: true,
        genres: [genreIds[2], genreIds[6]],
        cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
        director: "Robert Zemeckis",
      },
      {
        title: "The Notebook",
        description:
          "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom.",
        releaseYear: 2004,
        duration: 123,
        rating: 7.8,
        category: "romance",
        maturityRating: "PG-13",
        isPopular: true,
        genres: [genreIds[6]],
        cast: ["Ryan Gosling", "Rachel McAdams"],
        director: "Nick Cassavetes",
      },
      {
        title: "Planet Earth III",
        description:
          "A breathtaking documentary series showcasing the natural world.",
        releaseYear: 2024,
        duration: 360,
        rating: 9.3,
        category: "documentary",
        maturityRating: "G",
        isTopRated: true,
        genres: [genreIds[8]],
        cast: ["David Attenborough"],
        director: "BBC Studios",
      },
    ];

    const createdMovies = await Movie.insertMany(movies);
    console.log(`Created ${createdMovies.length} movies`);

    const tvshows = [
      {
        title: "Breaking Bad",
        description:
          "A high school chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine.",
        releaseYear: 2008,
        numberOfSeasons: 5,
        rating: 9.5,
        category: "drama",
        maturityRating: "R",
        isTrending: true,
        isPopular: true,
        isTopRated: true,
        genres: [genreIds[2], genreIds[5]],
        cast: ["Bryan Cranston", "Aaron Paul"],
        status: "ended",
      },
      {
        title: "Stranger Things",
        description:
          "When a young boy disappears, his mother and friends must confront terrifying supernatural forces.",
        releaseYear: 2016,
        numberOfSeasons: 5,
        rating: 8.7,
        category: "sci-fi",
        maturityRating: "TV-14",
        isTrending: true,
        isPopular: true,
        genres: [genreIds[4], genreIds[3]],
        cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder"],
        status: "ended",
      },
      {
        title: "The Witcher",
        description:
          "Geralt of Rivia, a monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        releaseYear: 2019,
        numberOfSeasons: 3,
        rating: 8.2,
        category: "action",
        maturityRating: "TV-MA",
        isPopular: true,
        genres: [genreIds[0], genreIds[4]],
        cast: ["Henry Cavill", "Anya Chalotra"],
        status: "ongoing",
      },
      {
        title: "The Office",
        description:
          "A mockumentary on a group of typical office workers at a paper company.",
        releaseYear: 2005,
        numberOfSeasons: 9,
        rating: 8.9,
        category: "comedy",
        maturityRating: "TV-14",
        isTopRated: true,
        genres: [genreIds[1]],
        cast: ["Steve Carell", "John Krasinski", "Rainn Wilson"],
        status: "ended",
      },
      {
        title: "Squid Game",
        description:
          "Hundreds of cash-strapped players accept a strange invitation to compete in children's games.",
        releaseYear: 2021,
        numberOfSeasons: 2,
        rating: 8.0,
        category: "thriller",
        maturityRating: "TV-MA",
        isTrending: true,
        isPopular: true,
        genres: [genreIds[5], genreIds[0]],
        cast: ["Lee Jung-jae", "Park Hae-soo"],
        status: "ongoing",
      },
      {
        title: "The Mandalorian",
        description:
          "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
        releaseYear: 2019,
        numberOfSeasons: 3,
        rating: 8.7,
        category: "sci-fi",
        maturityRating: "TV-PG",
        isTrending: true,
        isPopular: true,
        genres: [genreIds[4], genreIds[0]],
        cast: ["Pedro Pascal"],
        status: "ongoing",
      },
    ];

    const createdTVShows = await TVShow.insertMany(tvshows);
    console.log(`Created ${createdTVShows.length} TV shows`);

    console.log("\nSeed complete!");
    console.log("Admin login: admin@netflix.com / admin123");
    console.log("User login: john@netflix.com / user123");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
