const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const fs = require("fs/promises");

let adminToken;
let token;

setToken = async () => {
  const { body } = await request(app)
    .post("/auth/login")
    .send({ username: "admin", password: "admin" });

  adminToken = body.user.token;
  token = body.user.token;
};

setToken();

beforeEach(async () => {
  const data = await fs.readFile(
    `${__dirname.slice(0, -10)}/db/data/testdata.json`
  );

  await seed(JSON.parse(data));
});

afterAll(async () => db.end());

describe("/players", () => {
  describe("GET", () => {
    it("200:  Responds with players including total count", async () => {
      const { body } = await request(app)
        .get("/players")
        .set("Authorisation", `Bearer ${token}`)
        .expect(200);
      expect(body.count).toBeTruthy();
      expect(body.players).toHaveLength(2);
      expect(body.players[0].player_name).toBe("test_player_1");
    });
    it("200: Works with page and limit query", async () => {
      const { body } = await request(app)
        .get("/players?limit=5&p=2")
        .set("Authorisation", `Bearer ${token}`)
        .expect(200);
      expect(body.players).toHaveLength(0);
    });
    it("200: Works with search query", async () => {
      const { body } = await request(app)
        .get("/players?search=bo")
        .set("Authorisation", `Bearer ${token}`)
        .expect(200);
      expect(body.count).toBe(0);
      expect(body.exactMatch).toBe(null);
    });
    it("400: Returns an error if passed invalid limit/page", async () => {
      const { body } = await request(app)
        .get("/players?p=not_a_number")
        .set("Authorisation", `Bearer ${token}`)
        .expect(400);

      expect(body.error.message).toBe(
        `Limit/Page must be a non-decimal integer`
      );

      const { body: decimal } = await request(app)
        .get("/players?p=2.3")
        .set("Authorisation", `Bearer ${token}`)
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
        .set("Authorisation", `Bearer ${token}`)
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
        .set("Authorisation", `Bearer ${token}`)
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
        .set("Authorisation", `Bearer ${token}`)
        .send({ player_name: "test_player_1" })
        .expect(400);

      expect(body.error.message).toBe("User already exists");
    });
    it("400: Throws an error with an invalid body", async () => {
      const { body } = await request(app)
        .post("/players")
        .set("Authorisation", `Bearer ${token}`)
        .send({ player_name: ["fd"] });

      expect(body.error.message).toBe("Invalid body");
    });
  });
});

describe("/players/:player", () => {
  describe("GET", () => {
    it("200: Returns all information about a given player", async () => {
      const { body } = await request(app)
        .get("/players/test_player_1")
        .set("Authorisation", `Bearer ${token}`)
        .expect(200);

      expect(body).toMatchObject({
        player: expect.any(Object),
        notes: expect.any(Array),
        tendencies: expect.any(Array),
      });

      expect(body.player).toMatchObject({
        player_name: "test_player_1",
        type: null,
        p_created_at: expect.any(String),
      });
      expect(body.notes).toHaveLength(3);
      expect(body.tendencies).toHaveLength(2);
    });
    it("404: Returns an error if passed an invalid user", async () => {
      const { body } = await request(app)
        .get("/players/not_a_player_at_all")
        .set("Authorisation", `Bearer ${token}`)
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
        .patch("/players/test_player_1/type")
        .set("Authorisation", `Bearer ${token}`)
        .send({ type: "fish" })
        .expect(201);

      const { rows } = await db.query(
        `SELECT * FROM players WHERE player_name = 'test_player_1'`
      );

      expect(player).toMatchObject({
        player_name: "test_player_1",
        type: "fish",
        p_created_at: expect.any(String),
      });
      expect(rows[0].type).toBe("fish");
    });
    it("404: Returns an error if the user doesn't exist", async () => {
      const { body } = await request(app)
        .patch("/players/not_a_player/type")
        .set("Authorisation", `Bearer ${token}`)
        .send({ type: "fish" })
        .expect(404);
      expect(body.error.message).toBe("Non-existent user");
    });
    it("400: Returns an error if passed an invalid body", async () => {
      await request(app)
        .patch("/players/test_player_1/type")
        .set("Authorisation", `Bearer ${token}`)
        .send({ badKey: "invalid" })
        .expect(400);

      await request(app)
        .patch("/players/test_player_1/type")
        .set("Authorisation", `Bearer ${token}`)
        .send({ type: 233 })
        .expect(400);
    });
  });
});

describe("/notes", () => {
  describe("GET", () => {
    it("200: Returns with notes including total note count", async () => {
      const { body } = await request(app)
        .get("/notes")
        .set("Authorisation", `Bearer ${token}`)
        .expect(200);
      expect(body.notes).toHaveLength(4);
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
        .set("Authorisation", `Bearer ${token}`)
        .expect(400);

      expect(body.error.message).toBe(
        `Limit/Page must be a non-decimal integer`
      );

      const { body: decimal } = await request(app)
        .get("/notes?limit=5.2")
        .set("Authorisation", `Bearer ${token}`)
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
        "SELECT * FROM notes WHERE note_id = 2"
      );

      expect(pre).toHaveLength(1);

      await request(app)
        .del("/notes/2")
        .set("Authorisation", `Bearer ${token}`)
        .expect(204);

      const { rows: post } = await db.query(
        "SELECT * FROM notes WHERE note_id = 2"
      );

      expect(post).toHaveLength(0);
    });

    it("404: Returns an error if passed an id that doesn't exist yet", async () => {
      const { body } = await request(app)
        .del("/notes/349498")
        .set("Authorisation", `Bearer ${token}`)
        .expect(404);

      expect(body.error.message).toBe("Non-existent note");
    });

    it("400: Returns an error if passed a non-intiger value", async () => {
      const { body } = await request(app)
        .del("/notes/not-number")
        .set("Authorisation", `Bearer ${token}`)
        .expect(400);
      expect(body.error.message).toBe("Invalid id");
    });
  });
  describe("PATCH", () => {
    it("204: Updates the note body and the date of the specified note", async () => {
      await request(app)
        .patch("/notes/2")
        .set("Authorisation", `Bearer ${token}`)
        .send({ note: "This is the updated note for note 2" })
        .expect(201);

      const { rows } = await db.query(
        `SELECT * FROM notes WHERE note_id = '2'`
      );

      expect(rows[0].note).toBe("This is the updated note for note 2");
    });

    it("400: Returns an error if passed an invalid id", async () => {
      await request(app)
        .patch("/notes/not_an_id")
        .set("Authorisation", `Bearer ${token}`)
        .send({ note: "Invalid Id" })
        .expect(400);
    });
    it("404: Returns an error if passed an id of a note that doesn't exist", async () => {
      await request(app)
        .patch("/notes/3948348")
        .set("Authorisation", `Bearer ${token}`)
        .send({ note: "Invalid note id" })
        .expect(404);
    });
  });
});

describe("/notes/:player", () => {
  describe("GET", () => {
    it("200: Returns all notes for a given player", async () => {
      const { body } = await request(app)
        .get("/notes/test_player_1")
        .set("Authorisation", `Bearer ${token}`)
        .expect(200);
      expect(body.notes).toHaveLength(3);
    });
    it("404: Returns an error for non-existent user", async () => {
      const { body } = await request(app)
        .get("/notes/kdfnjbdsjbdsfkbds")
        .set("Authorisation", `Bearer ${token}`)
        .expect(404);
      expect(body.error.message).toBe("Non-existent user");
    });
  });
  describe("POST", () => {
    it("201: Adds a note to a specific user", async () => {
      const { body: pre } = await request(app)
        .get("/players/test_player_1")
        .set("Authorisation", `Bearer ${token}`)
        .expect(200);
      expect(pre.notes).toHaveLength(3);

      const { body } = await request(app)
        .post("/notes/test_player_1")
        .set("Authorisation", `Bearer ${token}`)
        .send({
          note: "flats cold 4 with k5s",
        })
        .expect(201);

      const { body: post } = await request(app)
        .get("/players/test_player_1")
        .set("Authorisation", `Bearer ${token}`);
      expect(post.notes).toHaveLength(4);

      expect(body.note).toMatchObject({
        note_id: expect.any(Number),
        player_name: "test_player_1",
        n_created_at: expect.any(String),
        note: "flats cold 4 with k5s",
      });
    });
    it("404: Returns an error if trying to add a note to non-existent user", async () => {
      const { body } = await request(app)
        .post("/notes/none-existent-player")
        .set("Authorisation", `Bearer ${token}`)
        .send({
          created_by: "Ctrl",
          note: "flats cold 4 with k5s",
        })
        .expect(404);

      expect(body.error.message).toBe("Non-existent user");
    });
    it("400: Returns an error if passed an invalid body", async () => {
      const { body } = await request(app)
        .post("/notes/test_player_1")
        .set("Authorisation", `Bearer ${token}`)
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
        [1]
      );
      expect(pre).toHaveLength(1);
      await request(app)
        .delete("/tendencies/1")
        .set("Authorisation", `Bearer ${token}`)
        .expect(204);
      const { rows: post } = await db.query(
        "SELECT * FROM tendencies WHERE tendency_id = $1",
        [1]
      );
      expect(post).toHaveLength(0);
    });

    it("400: Returns an error if passed a non-integer ID", async () => {
      await request(app)
        .delete("/tendencies/word_not_id")
        .set("Authorisation", `Bearer ${token}`)
        .expect(400);
    });
    it("404: Returns an error if passed an non-existent id", async () => {
      const { body } = await request(app)
        .delete("/tendencies/3489347")
        .set("Authorisation", `Bearer ${token}`)
        .expect(404);

      expect(body.error.message).toBe("Non-existent tendency");
    });
  });
  describe("PATCH", () => {
    it("204: Updates the tendency body and date of the specified tendency ", async () => {
      await request(app)
        .patch("/tendencies/2")
        .set("Authorisation", `Bearer ${token}`)
        .send({ tendency: "Updated tendency" })
        .expect(201);
    });

    it("400: Returns an error if passed an invalid id", async () => {
      await request(app)
        .patch("/tendencies/not_an_id")
        .set("Authorisation", `Bearer ${token}`)
        .send({ note: "Invalid Id" })
        .expect(400);
    });
    it("404: Returns an error if passed an id of a tendency that doesn't exist", async () => {
      await request(app)
        .patch("/tendencies/347374")
        .set("Authorisation", `Bearer ${token}`)
        .send({ note: "Invalid note id" })
        .expect(404);
    });
  });
});

describe("/tendencies/:player", () => {
  describe("POST", () => {
    it("201: Adds a tendency to the specified user ", async () => {
      const { rows: pre } = await db.query(
        "SELECT * FROM tendencies WHERE player_name = 'test_player_1'"
      );

      expect(pre).toHaveLength(2);

      const { body } = await request(app)
        .post("/tendencies/test_player_1")
        .set("Authorisation", `Bearer ${token}`)
        .send({ created_by: "admin", tendency: "Test tendency" })
        .expect(201);

      expect(body.tendency).toMatchObject({
        tendency_id: expect.any(Number),
        player_name: expect.any(String),
        tendency: expect.any(String),
        t_created_at: expect.any(String),
        t_created_by: expect.any(String),
      });

      const { rows: post } = await db.query(
        "SELECT * FROM tendencies WHERE player_name = 'test_player_1'"
      );

      expect(post).toHaveLength(3);
    });
    it("404: Returns an error if trying to add a tendency to a non-existent user", async () => {
      const { body } = await request(app)
        .post("/tendencies/none-existent-player")
        .set("Authorisation", `Bearer ${token}`)
        .send({
          created_by: "Ctrl",
          tendency: "flats cold 4 with k5s",
        })
        .expect(404);

      expect(body.error.message).toBe("Non-existent user");
    });
    it("400: Returns an error if passed an invalid body", async () => {
      const { body } = await request(app)
        .post("/tendencies/aaaa")
        .set("Authorisation", `Bearer ${token}`)
        .send({
          tendendcy: "flats cold 4 with k5s",
        })
        .expect(400);

      expect(body.error.message).toBe("Missing key");
    });
  });
});

describe("/auth/register", () => {
  it("201: Succesfully registers a user", async () => {
    const { body } = await request(app)
      .post("/auth/register")
      .send({ username: "test", password: "test", confirm: "test" })
      .expect(201);

    expect(body.user[0].username).toBe("test");
  });

  it("400: Returns an error if there's already a username by that name", async () => {
    await request(app)
      .post("/auth/register")
      .send({ username: "test", password: "test", confirm: "test" })
      .expect(201);

    await request(app)
      .post("/auth/register")
      .send({ username: "test", password: "test", confirm: "test" })
      .expect(400);
  });
});

describe("/auth/login", () => {
  it("200: Succesfully logs you in if given the correct password", async () => {
    await request(app)
      .post("/auth/register")
      .send({ username: "test", password: "test" })
      .expect(201);

    await request(app)
      .post("/auth/login")
      .send({ username: "test", password: "test" })
      .expect(200);
  });

  it("400: Returns an error if logged in as non-existent user", async () => {
    const { body } = await request(app)
      .post("/auth/login")
      .send({ username: "tezt", password: "test" })
      .expect(400);

    expect(body.error.message).toBe("Non-existent user");
  });

  it("400: Returns an error if passed an invalid password", async () => {
    await request(app)
      .post("/auth/register")
      .send({ username: "test", password: "test" })
      .expect(201);

    const { body } = await request(app)
      .post("/auth/login")
      .send({ username: "test", password: "incorrect password" })
      .expect(400);

    expect(body.error.message).toBe("Incorrect Password");
  });
});

describe("/admin/users", () => {
  it("200: Returns a list of all users", async () => {
    const { body } = await request(app)
      .get("/admin/users")
      .set("Authorisation", `Bearer ${adminToken}`)
      .expect(200);

    expect(body.users).toHaveLength(2);
  });
});

describe("/admin/users/:id", () => {
  it("201: Returns the amended user", async () => {
    const { body } = await request(app)
      .patch("/admin/users/2")
      .set("Authorisation", `Bearer ${adminToken}`)
      .send({ validated: true, admin: true })
      .expect(201);

    expect(body.user[0]).toMatchObject({
      username: "test_user",
      admin: true,
      validated: true,
      user_id: 2,
    });
  });
});
