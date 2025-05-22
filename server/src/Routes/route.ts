import express from "express";
import { signUp } from "../controllers/signup";
import { signIn } from "../controllers/signin";
import { logout } from "../controllers/logout";
import { authentication } from "../middleware/authentication";
import { add } from "../controllers/add";
import { del } from "../controllers/delete";
import { show } from "../controllers/show";
import { authValidator } from "../controllers/auth";
import { update } from "../controllers/update";
import { linkDataLoader } from "../controllers/linkDataLoader";
import { share } from "../controllers/share";
import { getShare } from "../controllers/getShare";
export let router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logout);
router.post("/add", authentication, add);
router.post("/delete/:linkId", authentication, del);
router.get("/authValid", authentication, authValidator);
router.post("/update/:id", authentication, update);
router.get("/show", authentication, show);
router.get("/linkData",  linkDataLoader);
router.post("/share",authentication, share);
router.get("/getShare/:shareId",getShare)
