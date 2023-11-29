import express, { Request, Response } from "express";
import Sequelize, { Op } from "sequelize";

import { parseQueryDate, parseQueryInt } from "../../utils/parseQuery";

const route = express.Router();

route.get("/admin/best-clients", async (req: Request, res: Response) => {
  const start = parseQueryDate(req.query.start as string | undefined);
  const end = parseQueryDate(req.query.end as string | undefined);
  const limit = parseQueryInt(req.query.limit as string | undefined) ?? 2;

  const sequelize = req.app.get("sequelize") as Sequelize.Sequelize;

  const startCondition =
    "AND strftime('%Y-%m-%d',j.paymentDate) >= strftime('%Y-%m-%d', ? )";
  const endCondition =
    "AND strftime('%Y-%m-%d',j.paymentDate) <= strftime('%Y-%m-%d', ? )";

  const query = `
      SELECT p.id, p.firstName, p.lastName, sum(j.price) as paid from Profiles p
      INNER JOIN Contracts c
      ON c.ClientId = p.id
      INNER JOIN Jobs j
      ON c.id = j.ContractId
      WHERE j.paid = 1
      ${start ? startCondition : ""}
      ${end ? endCondition : ""}
      GROUP BY p.id
      ORDER BY paid DESC
      LIMIT ?
    `;

  const dateValues = [start, end].filter(Boolean).map((e) => e?.toISOString());
  const queryValues = [...dateValues, limit];

  const [data] = await sequelize
    .query({
      query,
      values: queryValues,
    })
    .catch((err) => {
      console.log(err);
      return [[]];
    });

  const result = data as {
    id: number;
    firstName: string;
    lastName: string;
    paid: number;
  }[];

  const formattedResult = result.map((e) => ({
    id: e.id,
    fullName: `${e.firstName} ${e.lastName}`,
    paid: e.paid,
  }));

  res.json(formattedResult);
});

route.get("/admin/best-profession", async (req: Request, res: Response) => {
  const start = parseQueryDate(req.query.start as string | undefined);
  const end = parseQueryDate(req.query.end as string | undefined);

  const sequelize = req.app.get("sequelize") as Sequelize.Sequelize;

  const startCondition =
    "AND strftime('%Y-%m-%d',c.createdAt) >= strftime('%Y-%m-%d', ? )";
  const endCondition =
    "AND strftime('%Y-%m-%d',c.updatedAt) <= strftime('%Y-%m-%d', ? )";

  const query = `
      SELECT p.profession, sum(j.price) as total from Profiles p
      INNER JOIN Contracts c
      ON p.id = c.ContractorId
      INNER JOIN Jobs j
      ON j.ContractId = c.id
      WHERE j.paid = 1
      ${start ? startCondition : ""}
      ${end ? endCondition : ""}
      GROUP BY p.profession
      ORDER BY total DESC
      LIMIT 1
      `;

  const queryValues = [start, end].filter(Boolean).map((e) => e?.toISOString());

  const [data] = await sequelize.query({
    query,
    values: queryValues,
  });

  const result = data as { profession: string; total: number }[];

  if (result.length == 0) return res.status(404).end();

  res.json({
    profession: result[0].profession,
    amount: result[0].total,
  });
});

export const adminRoute = route;
