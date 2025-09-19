import { Router } from "express";
import { registerController, loginController, refreshController, logoutController, getProfileController, sendResetEmailController, resetPasswordController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createAuthSchema, loginSchema, resetEmailSchema, resetPasswordSchema } from "../validation/auth.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", validateBody(createAuthSchema), registerController);
router.post("/login", validateBody(loginSchema), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, getProfileController);
router.post("/send-reset-email", validateBody(resetEmailSchema), sendResetEmailController);
router.post("/reset-pwd", validateBody(resetPasswordSchema), resetPasswordController);

export default router;