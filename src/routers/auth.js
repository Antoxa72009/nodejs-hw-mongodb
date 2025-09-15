import { Router } from "express";
import { registerController, loginController, refreshController, logoutController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createAuthSchema, loginSchema } from "../validation/auth.js";

const router = Router();

router.post("/register", validateBody(createAuthSchema), registerController);
router.post("/login", validateBody(loginSchema), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);

export default router;