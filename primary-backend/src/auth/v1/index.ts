import signupController from "../../controllers/signup";
import { authRouter } from "../../routes";

authRouter.post("/signup", signupController);
