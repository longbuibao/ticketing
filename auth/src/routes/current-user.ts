import express from "express";

// import { currentUser, requireAuth } from '../middlewares';
import {
  currentUser,
  NotAuthorizedError,
  requireAuth,
} from "@lbbticket/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  if (!req.currentUser) throw new NotAuthorizedError();
  res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };
