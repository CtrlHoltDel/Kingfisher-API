const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const { notes, tendencies, players } = require("../db/data");

beforeEach(() => seed({ notes, tendencies, players }));
afterAll(() => db.end());

describe("/players", () => {
  describe("GET", () => {
    it("200:  Responds with players including total count", async () => {
      const { body } = await request(app).get("/players").expect(200);
      expect(body.count).toBe(462);
      expect(body.players).toHaveLength(10);
      expect(body.players[0].player_name).toBe("(7x axe emoji)");
    });
    it("200: Works with page and limit query", async () => {
      const { body } = await request(app)
        .get("/players?limit=5&p=2")
        .expect(200);
      expect(body.players).toHaveLength(5);
      expect(body.players[0].player_name).toBe("<<donkey>>");
    });
    it("200: Works with search query", async () => {
      const { body } = await request(app).get("/players?search=bo").expect(200);
      expect(body.count).toBe(18);
      expect(body.players).toHaveLength(10);

      expect(body.exactMatch).toBe(null);
    });
    it("200: Passes back an exact match as well as fuzzy", async () => {
      const { body } = await request(app)
        .get("/players?search=blue")
        .expect(200);

      expect(body.count).toBe(3);
      expect(body.players).toHaveLength(3);
      expect(body.exactMatch).toEqual({
        player_name: "blue",
        type: "passive fish",
        p_created_at: expect.any(String),
      });
    });
    it("400: Returns an error if passed invalid limit/page", async () => {
      const { body } = await request(app)
        .get("/players?p=not_a_number")
        .expect(400);

      expect(body.error.message).toBe(
        `Limit/Page must be a non-decimal integer`
      );

      const { body: decimal } = await request(app)
        .get("/players?p=2.3")
        .expect(400);

      expect(decimal.error.message).toBe(
        `Limit/Page must be a non-decimal integer`
      );
    });
  });
  describe("POST", () => {
    it("201: Creates a player - returns the new player", async () => {
      const { rows: pre } = await db.query(
        "SELECT * FROM players WHERE player_name = 'test_user'"
      );

      expect(pre).toHaveLength(0);

      const { body } = await request(app)
        .post("/players")
        .send({ player_name: "test_user", type: "fish" })
        .expect(201);

      const { rows: post } = await db.query(
        "SELECT * FROM players WHERE player_name = 'test_user'"
      );

      expect(post).toHaveLength(1);

      expect(body.player).toMatchObject({
        player_name: expect.any(String),
        type: expect.any(String),
        p_created_at: expect.any(String),
      });
    });
    it("201: Works if passed a body without type key", async () => {
      const { body } = await request(app)
        .post("/players")
        .send({ player_name: "Ctrl" })
        .expect(201);

      expect(body.player).toMatchObject({
        player_name: "Ctrl",
        type: null,
        p_created_at: expect.any(String),
      });
    });
    it("400: Throws an error if passed a user that already exists", async () => {
      const { body } = await request(app)
        .post("/players")
        .send({ player_name: "bubble boy" })
        .expect(400);

      expect(body.error.message).toBe("User already exists");
    });
    it("400: Throws an error with an invalid body", async () => {
      const { body } = await request(app)
        .post("/players")
        .send({ player_name: ["fd"] });

      expect(body.error.message).toBe("Invalid body");
    });
  });
});

describe("/players/:player", () => {
  describe("GET", () => {
    it("200: Returns all information about a given player", async () => {
      const { body } = await request(app).get("/players/**jj**").expect(200);

      expect(body).toMatchObject({
        player: expect.any(Object),
        notes: expect.any(Array),
        tendencies: expect.any(Array),
      });

      expect(body.player).toMatchObject({
        player_name: "**jj**",
        type: null,
        p_created_at: expect.any(String),
      });
      expect(body.notes).toHaveLength(2);
      expect(body.tendencies).toHaveLength(0);
    });
    it("404: Returns an error if passed an invalid user", async () => {
      const { body } = await request(app)
        .get("/players/not_a_player_at_all")
        .expect(404);

      expect(body.error.message).toBe("Non-existent user");
    });
  });
});

describe("/players/:player/type", () => {
  describe("PATCH", () => {
    it("400: Amends the type of a specified player ", async () => {
      const {
        body: { player },
      } = await request(app)
        .patch("/players/aakk/type")
        .send({ type: "fish" })
        .expect(201);

      const { rows } = await db.query(
        `SELECT * FROM players WHERE player_name = 'aakk'`
      );

      expect(player).toMatchObject({
        player_name: "aakk",
        type: "fish",
        p_created_at: expect.any(String),
      });
      expect(rows[0].type).toBe("fish");
    });
    it("404: Returns an error if the user doesn't exist", async () => {
      const { body } = await request(app)
        .patch("/players/not_a_player/type")
        .send({ type: "fish" })
        .expect(404);
      expect(body.error.message).toBe("Non-existent user");
    });
    it("400: Returns an error if passed an invalid body", async () => {
      const { body: badKey } = await request(app)
        .patch("/players/aakk/type")
        .send({ badKey: "invalid" })
        .expect(400);

      const { body: badValue } = await request(app)
        .patch("/players/aakk/type")
        .send({ type: 233 })
        .expect(400);
    });
  });
});

describe("/notes", () => {
  describe("GET", () => {
    it("200: Returns with notes including total note count", async () => {
      const { body } = await request(app).get("/notes").expect(200);
      expect(body.count).toBe(604);
      expect(body.notes).toHaveLength(10);
      body.notes.forEach((note) => {
        expect(note).toMatchObject({
          note_id: expect.any(Number),
          player_name: expect.any(String),
          n_created_at: expect.any(String),
          note: expect.any(String),
          n_created_by: expect.any(String),
        });
      });
    });
    it("400: Returns an error if passed invalid limit/page", async () => {
      const { body } = await request(app)
        .get("/notes?limit=4&p=notanumber")
        .expect(400);

      expect(body.error.message).toBe(
        `Limit/Page must be a non-decimal integer`
      );

      const { body: decimal } = await request(app)
        .get("/notes?limit=5.2")
        .expect(400);

      expect(decimal.error.message).toBe(
        `Limit/Page must be a non-decimal integer`
      );
    });
  });
});

describe("/notes/:id", () => {
  describe("DEL", () => {
    it("204: Deletes the note specified by the id", async () => {
      const { rows: pre } = await db.query(
        "SELECT * FROM notes WHERE note_id = 85"
      );

      expect(pre).toHaveLength(1);

      await request(app).del("/notes/85").expect(204);

      const { rows: post } = await db.query(
        "SELECT * FROM notes WHERE note_id = 85"
      );

      expect(post).toHaveLength(0);
    });

    it("404: Returns an error if passed an id that doesn't exist yet", async () => {
      const { body } = await request(app)
        .del("/notes/349498")

        .expect(404);

      expect(body.error.message).toBe("Non-existent note");
    });

    it("400: Returns an error if passed a non-intiger value", async () => {
      const { body } = await request(app)
        .del("/notes/not-number")

        .expect(400);
      expect(body.error.message).toBe("Invalid id");
    });
  });
  describe("PATCH", () => {
    it("204: Updates the note body and the date of the specified note", async () => {
      await request(app)
        .patch("/notes/10")
        .send({ note: "This is the updated note for note 10" })
        .expect(201);

      const { rows } = await db.query(
        `SELECT * FROM notes WHERE note_id = '10'`
      );

      expect(rows[0].note).toBe("This is the updated note for note 10");
    });

    it("400: Returns an error if passed an invalid id", async () => {
      await request(app)
        .patch("/notes/not_an_id")
        .send({ note: "Invalid Id" })
        .expect(400);
    });
    it("404: Returns an error if passed an id of a note that doesn't exist", async () => {
      await request(app)
        .patch("/notes/3948348")
        .send({ note: "Invalid note id" })
        .expect(404);
    });
  });
});

describe("/notes/:player", () => {
  describe("GET", () => {
    it("200: Returns all notes for a given player", async () => {
      const { body } = await request(app).get("/notes/$$$subbu$$$").expect(200);
      expect(body.notes).toHaveLength(3);
    });
    it("404: Returns an error for non-existent user", async () => {
      const { body } = await request(app)
        .get("/notes/kdfnjbdsjbdsfkbds")
        .expect(404);
      expect(body.error.message).toBe("Non-existent user");
    });
  });
  describe("POST", () => {
    it("201: Adds a note to a specific user", async () => {
      const { body: pre } = await request(app).get("/players/aaaa");
      expect(pre.notes).toHaveLength(1);

      const { body } = await request(app)
        .post("/notes/aaaa")
        .send({
          created_by: "Ctrl",
          note: "flats cold 4 with k5s",
        })
        .expect(201);

      const { body: post } = await request(app).get("/players/aaaa");
      expect(post.notes).toHaveLength(2);

      expect(body.note).toMatchObject({
        note_id: 605,
        player_name: "aaaa",
        n_created_at: expect.any(String),
        note: "flats cold 4 with k5s",
        n_created_by: "Ctrl",
      });
    });
    it("404: Returns an error if trying to add a note to non-existent user", async () => {
      const { body } = await request(app)
        .post("/notes/none-existent-player")
        .send({
          created_by: "Ctrl",
          note: "flats cold 4 with k5s",
        })
        .expect(404);

      expect(body.error.message).toBe("Non-existent user");
    });
    it("400: Returns an error if passed an invalid body", async () => {
      const { body } = await request(app)
        .post("/notes/aaaa")
        .send({ missing: "key" })
        .expect(400);

      expect(body.error.message).toBe("Invalid body");
    });
  });
});

describe("/tendencies/:id", () => {
  describe("DEL", () => {
    it("204: Deletes the tendency at the specified id", async () => {
      const { rows: pre } = await db.query(
        "SELECT * FROM tendencies WHERE tendency_id = $1",
        [4]
      );
      expect(pre).toHaveLength(1);
      await request(app).delete("/tendencies/4").expect(204);
      const { rows: post } = await db.query(
        "SELECT * FROM tendencies WHERE tendency_id = $1",
        [4]
      );
      expect(post).toHaveLength(0);
    });

    it("400: Returns an error if passed a non-integer ID", async () => {
      await request(app).delete("/tendencies/word_not_id").expect(400);
    });
    it("404: Returns an error if passed an non-existent id", async () => {
      const { body } = await request(app)
        .delete("/tendencies/3489347")
        .expect(404);

      expect(body.error.message).toBe("Non-existent tendency");
    });
  });
  describe("PATCH", () => {
    it("204: Updates the tendency body and date of the specified tendency ", async () => {
      await request(app)
        .patch("/tendencies/5")
        .send({ tendency: "Updated tendency" })
        .expect(201);
    });

    it("400: Returns an error if passed an invalid id", async () => {
      await request(app)
        .patch("/tendencies/not_an_id")
        .send({ note: "Invalid Id" })
        .expect(400);
    });
    it("404: Returns an error if passed an id of a tendency that doesn't exist", async () => {
      await request(app)
        .patch("/tendencies/347374")
        .send({ note: "Invalid note id" })
        .expect(404);
    });
  });
});
