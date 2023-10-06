const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Course = require("../../../models/educationModel/educationCourseModel");
const Live = require("../../../models/educationModel/educationLiveModel");
//delete | update | follow  
exports.checkLiveAuthority=[
    check("id")
    .notEmpty()
    .withMessage("send liveId in param please")
    .isMongoId()
    .withMessage("Invalid liveId")
    .custom((liveId,{req})=>
        new Promise((resolve, reject) => {
            if(req.user.role==="admin"){
                resolve();
            }
            Live.findOne({
                _id: liveId,
                creator: req.user._id ,
                
              })
                .then((live) => {
                  if (live) {
                    // User is the instructor of the course
                    resolve();
                  } else {
                    // User does not have the necessary authority
                    reject(new Error("Access denied"));
                  }
                })
                .catch((error) => {
                  reject(new Error(error));
                });
        })

    )

,
validatorMiddleware
]

exports.createLiveValidator=[
  check("title").notEmpty().withMessage("title is required")
  .isString().withMessage("Strings only allowed")
  .isLength({min:3}).withMessage("too short title")
  .isLength({max:40}).withMessage("too long title"),

  check("course").notEmpty().withMessage("course is required")
  .isMongoId().withMessage("invalid id")
  .custom((courseId,{req})=>
       new Promise((resolve,reject) => {
        if(req.user.role === "admin") 
        {resolve();}
        Course.findById(courseId).then((course)=>{
          if(!course){
            reject(new Error(`Course Not Found`, 404));
          }
          else if(course.instructor !== req.user._id){
            reject(new Error(`you are Not allowed to create live for this course`, 404));   
          }
          else{
            resolve();
          }

        }).catch((error)=>{
          reject(new Error(`error happened ${error}`))
        })
       })
  ),
  check("date")
  .notEmpty().withMessage("day is required"),
  check("hour")
  .notEmpty().withMessage("hour is required")
  ,

   check("duration")
  .notEmpty().withMessage("duration is required")
  .isInt({ min: .5, max: 5 }).withMessage("Enter a duration with hours")

  ,

  validatorMiddleware
]



exports.updateLiveValidator=[
  check("title").optional()
  .isString().withMessage("Strings only allowed")
  .isLength({min:3}).withMessage("too short title")
  .isLength({max:40}).withMessage("too long title"),

  check("course").optional()
  .isMongoId().withMessage("invalid id")
  .custom((courseId,{req})=>
       new Promise((resolve,reject) => {
        if(req.user.role === "admin") 
        {resolve();}
        Course.findById(courseId).then((course)=>{
          if(!course){
            reject(new Error(`Course Not Found`, 404));
          }
          else if(course.instructor !== req.user._id){
            reject(new Error(`you are Not allowed to create live for this course`, 404));   
          }
          else{
            resolve();
          }

        }).catch((error)=>{
          reject(new Error(`error happened ${error}`))
        })
       })
  ),
  check("date")
  .optional(),


  check("duration")
  .optional()
  .isInt({ min: .5, max: 5 }).withMessage("Enter a duration with hours")

  ,

  validatorMiddleware
]