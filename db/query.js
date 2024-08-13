const pool = require("./pool");

function multipleInsertsParameterization(numOfInserts) {
   result = [];

   currentParameter = 1;
   for (let i = 0; i < numOfInserts; i++) {
      result.push(`($${currentParameter}, $${currentParameter + 1})`);
      currentParameter += 2;
   }

   return result.join(", ");
}

function pairGameWithCategory(gameId, categoryIdsArr) {
   result = [];

   categoryIdsArr.forEach((id) => {
      result.push(gameId);
      result.push(id);
   });
}

class GameService {
   async getAllGames() {
      const { rows } = await pool.query("SELECT * FROM game;");

      return rows;
   }

   async getGame(id) {
      const { rows } = await pool.query("SELECT * FROM game WHERE id = $1;", [id]);

      return rows[0];
   }

   async createGame({
      title,
      description,
      release,
      price,
      quantity,
      rating,
      genres,
      developers,
      platforms,
   }) {
      const gameId = pool.query(
         "INSERT INTO game (title, description, rating, release_year, price, quantity) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;",
         [title, description, rating, release, price, quantity]
      );

      const genresInsertParameterization = multipleInsertsParameterization(genres.length);
      pool.query(
         `INSERT INTO game_genre (game_id, genre_id) VALUES ${genresInsertParameterization};`,
         pairGameWithCategory(gameId, genres)
      );

      const developersInsertParameterization = multipleInsertsParameterization(developers.length);
      pool.query(
         `INSERT INTO game_developer (game_id, developer_id) VALUES ${developersInsertParameterization};`,
         pairGameWithCategory(gameId, developers)
      );

      const platformsInsertParamterization = multipleInsertsParameterization(platforms.length);
      pool.query(
         `INSERT INTO game_platform (game_id, platform_id) VALUES ${platformsInsertParamterization};`,
         pairGameWithCategory(gameId, platforms)
      );
   }
}

class GenreService {
   async getAllGenres() {
      const { rows } = await pool.query("SELECT * FROM genre");

      return Promise.resolve(rows);
   }

   async getAllGamesInGenre(id) {
      const gamesQuery = `SELECT game.* 
      FROM game 
      JOIN game_genre ON game.id = game_genre.game_id 
      JOIN genre ON game_genre.genre_id = genre.id
      WHERE genre.id = $1;`;

      const [games, genreName] = await Promise.all([
         pool.query(gamesQuery, [id]),
         pool.query("SELECT name FROM genre WHERE id = $1", [id]),
      ]);

      return { games: games.rows, genreName: genreName.rows[0].name };
   }

   async createGenre(name) {
      await pool.query("INSERT INTO genre (name) VALUES ($1);", [name]);
   }
}

class DeveloperService {
   async getAllDevelopers() {
      const { rows } = await pool.query("SELECT * FROM developer;");

      return Promise.resolve(rows);
   }

   async getAllGamesByDeveloper(id) {
      const gamesQuery = `SELECT game.* 
      FROM game 
      JOIN game_developer ON game.id = game_developer.game_id 
      JOIN developer ON game_developer.developer_id = developer.id
      WHERE developer.id = $1;`;

      const [games, developerName] = await Promise.all([
         pool.query(gamesQuery, [id]),
         pool.query("SELECT name FROM developer WHERE id = $1", [id]),
      ]);

      return { games: games.rows, developerName: developerName.rows[0].name };
   }

   async createDeveloper(name) {
      await pool.query("INSERT INTO developer (name) VALUES ($1);", [name]);
   }
}

class PlatformService {
   async getAllPlatforms() {
      const { rows } = await pool.query("SELECT * FROM platform;");
      return Promise.resolve(rows);
   }

   async getAllGamesOnPlatform(id) {
      const gamesQuery = `SELECT game.* 
      FROM game 
      JOIN game_platform ON game.id = game_platform.game_id 
      JOIN platform ON game_platform.platform_id = platform.id
      WHERE platform.id = $1;`;

      const [games, platformName] = await Promise.all([
         pool.query(gamesQuery, [id]),
         pool.query("SELECT name FROM platform WHERE id = $1", [id]),
      ]);

      return { games: games.rows, platformName: platformName.rows[0].name };
   }

   async createPlatform(name) {
      await pool.query("INSERT INTO platform (name) VALUES ($1);", [name]);
   }
}

class IndexService {
   async getInventoryCount() {
      const [gamesCount, genresCount, platformsCount, developersCount] = await Promise.all([
         pool.query("SELECT COUNT(*) FROM game;"),
         pool.query("SELECT COUNT(*) FROM genre;"),
         pool.query("SELECT COUNT(*) FROM platform;"),
         pool.query("SELECT COUNT(*) FROM developer;"),
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
