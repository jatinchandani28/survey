var express = require("express");
var router = express.Router();
const controller = require("../controller/index");
const { verifyTokenFn } = require("../helper/jwt");

  
//user module router
router.post("/registerCoordinator", controller.coordinator_Register);
router.post("/login", controller.coordinator_Login);
router.put("/update",verifyTokenFn,controller.updateCoordinator);
router.get("/show/:id",verifyTokenFn, controller.getDetails);
router.delete("/deleteCoordinator/:id",verifyTokenFn, controller.delete);

//tutors
router.post("/create_respondent", controller.respondent_create);
router.get("/showSurvey",verifyTokenFn, controller.getAllSurvey);
router.delete("/delete_survey/:id",verifyTokenFn, controller.deleteSurvey);

module.exports = router;
