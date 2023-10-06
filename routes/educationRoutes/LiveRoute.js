const express = require("express");
const authServices = require("../../services/authServices");
const {
  checkAuthority2,
} = require("../../utils/validators/educationValidators/lessonsValidator");
const {
  createLive,
  getAllLives,
  getLivebyId,
  updateLive,
  deleteLive,
  followLive,
  SendEmailsToLiveFollwers,
  createFilterObj,
  setCreatorIdToBody,
  searchByDate,
  createLiveObj,
  filterFollowedBydate,
  myFollowedLives,
} = require("../../services/educationServices/LiveService");
// Validation
const {
  checkLiveAuthority,
  createLiveValidator,
  updateLiveValidator,
} = require("../../utils/validators/educationValidators/liveValidator");

const router = express.Router();

//create   admin  instructor of course
//update delete admin instructorof course
//send emails to students
router.get("/:courseId?", authServices.protect, createFilterObj, getAllLives);
router.get(
  "/myFollowedLives/:date?",
  authServices.protect,
  filterFollowedBydate,
  myFollowedLives
);
// router.get("/all/:courseId?", authServices.protect, authServices.allowedTo("admin"), getAllLives);
router.get("/searchByDate/:date", searchByDate);

router
  .route("/") //middleware
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "instructor"),
    createLiveValidator,
    setCreatorIdToBody,
    createLiveObj,
    createLive
  );

router
  .route("/sendEmailsToFollowers/:id")
  .post(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    checkLiveAuthority,
    SendEmailsToLiveFollwers
  );

router
  .route("/:id")
  .get(authServices.protect, checkLiveAuthority, getLivebyId)
  .put(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    checkLiveAuthority,
    updateLiveValidator,
    createLiveObj,
    updateLive
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    checkLiveAuthority,
    deleteLive
  );

//follow a specific live
router.put(
  "/followLive/:courseId/:liveId",
  authServices.protect,
  authServices.allowedTo("user", "admin"),
  checkAuthority2,
  followLive
);

//          middleware-> link

module.exports = router;
