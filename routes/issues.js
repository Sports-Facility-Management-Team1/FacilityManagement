import express from 'express';

import { verifyToken } from '../middleware/verifyToken.js'

const createIssuesRouter =  (db, admin) => {

const router = express.Router();

  router.get("/api/issues", verifyToken(admin.auth()),async (req, res) => {
    const uid = req.user.uid; 
    try {
      const snapshot = await db.collection("Issues").where("submittedBy", "==", uid).get();

      const issues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({ issues });
    } catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({ error: "Failed to get issues" });
    }
  });

  router.post("/api/report", verifyToken(admin.auth()), async (req, res) => {
    const { title, description, facility } = req.body;
    const uid = req.user.uid; 

    if (!title || !description || !facility) {
      return res.status(400).json({ error: "All fields required" });
    }

    try {
      await db.collection("Issues").add({
        title,
        description,
        facility,
        submittedBy: uid,
        status: "Pending",
        createdAt: new Date(),
      });

      res.status(200).json({ message: "Report submitted" });
    } catch (error) {
      console.error("Report save error:", error);
      res.status(500).json({ error: "Failed to save report" });
    }
  });
    
  router.get('/api/status-counts', verifyToken(admin.auth()), async (req, res) => {
  try {
    const snapshot = await db.collection("Issues").get();
    
    let counts = {
      solved: 0,
      unsolved: 0
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Explicit null/undefined check
      if (!data || typeof data.status !== 'string') {
        counts.unsolved++; // Count as unsolved if status is missing or invalid
        return; // Continue to next document
      }

      const status = data.status.toLowerCase();
      
      if (status === "solved") {
        counts.solved++;
      } else {
        counts.unsolved++; // Count everything else as unsolved
      }
    });

    res.status(200).json({
      success: true,
      data: {
        series: [counts.solved, counts.unsolved],
        labels: ["Solved", "Unsolved"]
      }
    });

  } catch (error) {
    console.error("Error fetching status counts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issue status counts"
    });
  }
  });

  router.get('/api/issues/all', async (req, res) => {
    try{
      const snapshot = await db.collection("Issues").get();
      const issues = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        };
      });

      res.status(200).json({ success: true, issues });
    }
    catch (error){
      console.error("Error fetching all issues:", error);
      res.status(500).json({ success: false, message: "Failed to fetch issues" });
    }
  });



  return router

};
export default createIssuesRouter;