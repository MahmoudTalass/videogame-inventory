const pool = require("./pool");

class GameService {
   async getAllGames() {
      const { rows } = await pool.query("SELECT * FROM game");

      return rows;
   }

   async getGame(id) {
      const { rows } = await pool.query("SELECT * FROM game WHERE id = $1", [id]);

      return rows[0];
   }
}

class GenreService {
   async getAllGenres() {
      const { rows } = await pool.query("SELECT * FROM genre");

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
}

class DeveloperService {
   async getAllDevelopers() {
      const { rows } = await pool.query("SELECT * FROM developer");

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
}

class PlatformService {
   async getAllPlatforms() {
      const { rows } = await pool.query("SELECT * FROM platform");

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

class IndexService {
   async getInventoryCount() {
      const [gamesCount, genresCount, platformsCount, developersCount] = await Promise.all([
         pool.query("SELECT COUNT(*) FROM game"),
         pool.query("SELECT COUNT(*) FROM genre"),
         pool.query("SELECT COUNT(*) FROM platform"),
         pool.query("SELECT COUNT(*) FROM developer"),
      ]);

      return {
         gamesCount: gamesCount.rows[0].count,
         genresCount: genresCount.rows[0].count,
         platformsCount: platformsCount.rows[0].count,
         developersCount: developersCount.rows[0].count,
      };
   }
}

module.exports = {
   IndexService: new IndexService(),
   PlatformService: new PlatformService(),
   DeveloperService: new DeveloperService(),
   GenreService: new GenreService(),
   GameService: new GameService(),
};
