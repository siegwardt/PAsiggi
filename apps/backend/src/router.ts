import { Router } from "express";
import userRouter from "./modules/users/user.router";
import productRouter from "./modules/products/product.router";
import categoryRouter from "./modules/categories/category.router";
import bundleRouter from "./modules/bundles/bundle.router";
import authRouter from "./modules/auth/auth.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/users", userRouter); 

apiRouter.use("/products", productRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/bundles", bundleRouter);

export default apiRouter;
