const db = require("../db/connection");
const { checkTendency } = require("../utils/db");
const validation = require("../utils/validation");

exports.removeTendency = async ({ id }) => {
  await validation.id(id);
  if (await checkTendency(id))
    return Promise.reject({ status: 404, message: "Non-existent tendency" });
  const query = "DELETE FROM tendencies WHERE tendency_id = $1";

  await db.query(query, [id]);
};

exports.amendTendency = async ({ id }, { tendency }) => {
  await validation.id(id);

  if (await checkTendency(id))
    return Promise.reject({ status: 404, message: "Non-existent tendency" });

  const query = `UPDATE tendencies SET tendency = $1, t_created_at = $2 WHERE tendency_id = $3 RETURNING *`;

  const { rows } = await db.query(query, [tendency, new Date(), id]);

  return rows[0];
};
