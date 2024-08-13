const {
   multipleInsertsParameterization,
   pairGameWithCategory,
   multipleDeleteParameterization,
} = require("../helpers/helpers");
const pool = require("./pool");

class GameService {
   async getAllGames() {
      const { rows } = await pool.query("SELECT * FROM game;");

      return rows;
   }

   async getGame(id) {
      const { rows } = await pool.query("SELECT * FROM game WHERE id = $1;", [id]);

      return Promise.resolve(rows[0]);
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
      const { rows } = await pool.query(
         "INSERT INTO game (title, description, rating, release_year, price, quantity) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;",
         [title, description, rating, release, price, quantity]
      );
      const gameId = rows[0].id;

      const genresInsertParameterization = multipleInsertsParameterization(genres.length);

      await pool.query(
         `INSERT INTO game_genre (game_id, genre_id) VALUES ${genresInsertParameterization};`,
         pairGameWithCategory(gameId, genres)
      );

      const developersInsertParameterization = multipleInsertsParameterization(developers.length);
      await pool.query(
         `INSERT INTO game_developer (game_id, developer_id) VALUES ${developersInsertParameterization};`,
         pairGameWithCategory(gameId, developers)
      );

      const platformsInsertParamterization = multipleInsertsParameterization(platforms.length);
      await pool.query(
         `INSERT INTO game_platform (game_id, platform_id) VALUES ${platformsInsertParamterization};`,
         pairGameWithCategory(gameId, platforms)
      );
   }

   async getDetailsOfGame(id) {
      const [genres, developers, platforms] = await Promise.all([
         pool.query("SELECT genre_id FROM game_genre WHERE game_id = $1", [id]),
         pool.query("SELECT developer_id FROM game_developer WHERE game_id = $1", [id]),
         pool.query("SELECT platform_id FROM game_platform WHERE game_id = $1", [id]),
      ]);
      const genresOfGame = genres.rows.map((genre) => genre.genre_id);
      const developersOfGame = developers.rows.map((developer) => developer.developer_id);
      const platformsOfGame = platforms.rows.map((platform) => platform.platform_id);

      return { genresOfGame, developersOfGame, platformsOfGame };
   }

   async updateGame({
      title,
      description,
      release,
      price,
      quantity,
      rating,
      newGenres,
      newDevelopers,
      newPlatforms,
      genresToBeDeleted,
      developersToBeDeleted,
      platformsToBeDeleted,
   }) {
      const { rows } = await pool.query(
         "UPDATE game SET title = $1, description = $2, release = $3, price = $4, quantity = $5, rating = $6 RETURNING id;",
         [title, description, release, price, quantity, rating]
      );

      const gameId = rows[0].id;

      const genresInsertParameterization = multipleInsertsParameterization(newGenres.length);
      const developersInsertParameterization = multipleInsertsParameterization(
         newDevelopers.length
      );
      const platformsInsertParamterization = multipleInsertsParameterization(newPlatforms.length);

      const genresDeleteParameterization = multipleDeleteParameterization(
         gameId,
         genresToBeDeleted.length
      );
      const developersDeleteParameterization = multipleDeleteParameterization(
         gameId,
         developersToBeDeleted.length
      );
      const platformsDeleteParameterization = multipleDeleteParameterization(
         gameId,
         platformsToBeDeleted.length
      );

      await Promise.all([
         pool.query(
            `INSERT INTO game_genre (game_id, genre_id) VALUES ${genresInsertParameterization};`,
            pairGameWithCategory(gameId, newGenres)
         ),
         pool.query(
            `INSERT INTO game_developer (game_id, developer_id) VALUES ${developersInsertParameterization};`,
            pairGameWithCategory(gameId, newDevelopers)
         ),
         pool.query(
            `INSERT INTO game_platform (game_id, platform_id) VALUES ${platformsInsertParamterization};`,
            pairGameWithCategory(gameId, newPlatforms)
         ),
         pool.query(`DELETE FROM game_genre WHERE ${genresDeleteParameterization};`, [
            genresToBeDeleted,
         ]),
         pool.query(`DELETE FROM game_developer WHERE ${developersDeleteParameterization};`, [
            developersToBeDeleted,
         ]),
         pool.query(`DELETE FROM game_platform WHERE ${platformsDeleteParameterization};`, [
            platformsToBeDeleted,
         ]),
      ]);
   }
}

class GenreService {
   async getAllGenres() {
      const { rows } = await pool.query("SELECT * FROM genre;");

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
