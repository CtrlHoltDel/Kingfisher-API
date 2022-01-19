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
      expect(body.count).toBe(461);
      expect(body.players).toHaveLength(10);
      expect(body.players[0].player_name).toBe("ninja warrior");
    });
    it("200: Works with page and limit query", async () => {
      const { body } = await request(app)
        .get("/players?limit=5&p=2")
        .expect(200);
      expect(body.players).toHaveLength(5);
      expect(body.players[0].player_name).toBe("<<donkey>>");
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
          created_at: expect.any(String),
          note: expect.any(String),
          created_by: expect.any(String),
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

describe("/notes/:player", () => {
  describe("GET", () => {
    it("200: Returns all notes for a given player", async () => {
      const { body } = await request(app).get("/notes/$$$subbu$$$").expect(200);
      expect(body.notes).toHaveLength(3);
    });
    it("404: Returns an error for non-existant user", async () => {
      const { body } = await request(app)
        .get("/notes/kdfnjbdsjbdsfkbds")
        .expect(404);
      expect(body.error.message).toBe("Non-existent user");
    });
  });
});
