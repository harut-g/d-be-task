import express, { Request, Response } from "express";
import { Contract } from "../../model";

import { getProfile } from "../../middleware/getProfile";
import Sequelize from "sequelize";
import { ContractStatus } from "../../model/contract.model";

const route = express.Router();

route.get("/contracts", getProfile, async (req: Request, res: Response) => {
  const profile = req.profile!;

  const contracts = await Contract.findAll({
    where: {
      [Sequelize.Op.and]: {
        status: {
          [Sequelize.Op.ne]: ContractStatus.Terminated,
        },
        [Sequelize.Op.or]: {
          ClientId: {
            [Sequelize.Op.eq]: profile.id,
          },
          ContractorId: {
            [Sequelize.Op.eq]: profile.id,
          },
        },
      },
    },
  });

  res.json(contracts);
});

route.get("/contracts/:id", getProfile, async (req: Request, res: Response) => {
  const profile = req.profile!;

  const { id } = req.params;
  const contract = await Contract.findOne({ where: { id } });

  if (!contract) return res.status(404).end();

  const contractBelongsToProfile =
    contract.ClientId === profile.id || contract.ContractorId === profile.id;

  if (!contractBelongsToProfile) return res.status(401).end();

  res.json(contract);
});

export const contractsRoute = route;
