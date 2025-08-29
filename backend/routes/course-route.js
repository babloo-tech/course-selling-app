import { createCourse, updateCourse, deleteCourse, getCourse, courseDetails, buyCourses } from "../controllers/course-controller.js"
import express from "express";
import userMiddlerware from "../middlewares/user.mid.js";
import adminMiddlerware from "../middlewares/admin.mid.js";
const router =express.Router()

router.post("/create", adminMiddlerware, createCourse)
router.put("/update/:courseId", adminMiddlerware, updateCourse)
router.delete("/delete/:courseId", adminMiddlerware, deleteCourse)
router.get("/courses", getCourse);
router.get("/:courseId",courseDetails)

router.post("/buy/:courseId",userMiddlerware,buyCourses)

export default router