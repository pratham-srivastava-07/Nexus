import { loginController, signupController } from "../../controllers";
import { authRouter } from "../../routes";

authRouter.post("/signup", signupController);

authRouter.post("/login", loginController);