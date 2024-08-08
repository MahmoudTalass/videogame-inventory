const pool = require("./pool");

class GameService {
   async getAllGames() {
      const { rows } = await pool.query("SELECT * FROM game");

      return rows;
   }
   async getAllGamesInGenre(id) {
      const { rows } = await pool.query(
         `SELECT game.*
      FROM game 
      JOIN game_genre ON game.id = game_genre.game_id 
      JOIN genre ON game_genre.genre_id = genre.id
      WHERE genre.id = $1`,
         [id]
      );

      return rows;
   }
   async getAllGamesByDeveloper(id) {
      const { rows } = await pool.query(
         `SELECT game.*
      FROM game 
      JOIN game_developer ON game.id = game_developer.game_id 
      JOIN developer ON game_developer.developer_id = developer.id
      WHERE developer.id = $1`,
         [id]
      );

      return rows;
   }
   async getAllGamesOnPlatform(id) {
      const { rows } = await pool.query(
         `SELECT game.*
      FROM game 
      JOIN game_platform ON game.id = game_platform.game_id 
      JOIN platform ON game_platform.platform_id = platform.id
      WHERE platform.id = $1`,
         [id]
      );

      return rows;
   }
}

class GenreService {
   async getAllGenres() {
      const { rows } = await pool.query("SELECT * FROM genre");

      return rows;
   }
}

class DeveloperService {
   async getAllDevelopers() {
      const { rows } = await pool.query("SELECT * FROM developer");

      return rows;
   }
}

class PlatformService {
   async getAllPlatforms() {
      const { rows } = await pool.query("SELECT * FROM platform");

      return rows;
   }
}

class IndexService {
   async getAllCategories() {
      const { rows } = await pool.query("SELECT * FROM games");

      return rows;
   }
}

module.exports = {
   IndexService: new IndexService(),
   PlatformService: new PlatformService(),
   DeveloperService: new DeveloperService(),
   GenreService: new GenreService(),
   GameService: new GameService(),
};
