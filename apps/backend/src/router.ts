import { Router } from "express";
import userRouter from "./modules/users/user.router";
import authRouter from "./modules/auth/auth.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/users", userRouter);

export default apiRouter;
