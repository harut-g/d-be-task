import { NextFunction, Request, Response } from "express";
import { Profile } from "../model";

declare global {
  namespace Express {
    interface Request {
      profile?: Profile;
    }
  }
}

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const profile = await Profile.findOne({
    where: { id: req.get("profile_id") || 0 },
  });

  if (!profile) return res.status(401).end();

  req.profile = profile;
  next();
};
