import express from "express";
import {
  createProject,
  getProjectData,
  getTask,
} from "../controllers/projectController.js";
import { protect, permissionsOne } from "../middleware/authMiddleware.js";
import Project from "../models/project.js";
import User from "../models/user.js";
const router = express.Router();

router.post("/", protect, createProject);
router.get("/:projectId", protect, permissionsOne, getProjectData);
router.get("/getTask/:projectId/:taskId", protect, permissionsOne, getTask);

router.post("/:projectId/users", async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;
  console.log("=====================", userId, projectId);

  try {
    const project = await Project.findById(projectId);
    const user = await User.findById(userId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the user to the project's users array
    project.users.push({
      user: userId,
      permissions: 1, // Adjust the permissions as needed
      tasksAssigned: [],
    });

    await project.save();
    user.projectsJoined.push(projectId);
    await user.save();

    res.status(200).json({ message: "User added to project successfully" });
    // res.status(200).json({ message: "User added to project successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
