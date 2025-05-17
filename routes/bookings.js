import express from 'express';

import { verifyToken } from '../middleware/verifyToken.js'

const createBookingsRouter =  (db, admin) => {

const router = express.Router();

  router.post("/api/createEvent", verifyToken(admin.auth()),async (req,res) => {
    const {title, description, facility, start, end, who}=req.body 
    const uid=req.user.uid;
    if (!title || !description || !facility || !start || !end || !who) {
      return res.status(400).json({ error: "All fields required" });
    }

    try {

        const snapShot=await db.collection("users").where("role","==","resident").get();

        const users= snapShot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (const user of users) {
          const docRef = db.collection("notifications").doc();
          const n_id=docRef.id;
          console.log(n_id);
          await docRef.set({
            id: n_id,
            recipient: user.id,
            title,
            description,
            facility,
            submittedBy: uid,
            start,
            end,
            read: "false"
          });
        }

      const newStart = admin.firestore.Timestamp.fromDate(new Date(start));
      const newEnd = admin.firestore.Timestamp.fromDate(new Date(end));




      const overlapping = await db.collection("bookings")
        .where("facility", "==", facility)
        .where("status", "==","Approved")
        .where("start", "<", newEnd)
        .where("end", ">", newStart)
        .get();

      if (!overlapping.empty) {
        return res.status(409).json({ error: "Event conflict detected" });
      }


      await db.collection("bookings").add({
        title,
        description,
        facility,
        submittedBy: uid,
        //date,
        status:"Approved",
        start:newStart,
        end:newEnd,
        who,
        //createdAt: new Date(),
      });

      res.status(200).json({ message: "Report submitted" });
    }
    catch{
      console.error("Report save error:", error);
      res.status(500).json({ error: "Failed to save event" });
  }

  });

   router.get('/api/get-reports',async (req,res)=>{
        try {
        const getIt=await db.collection("Issues").get();
        const reports = getIt.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        res.status(200).send(reports);
      } catch (error) {
        console.error(error);
        
      }
  });

  router.get("/api/staff-bookings",async (req,res) => {
    
    try {
      const getIt=await db.collection("bookings").where("status","==","Pending").get();
      const bookings=getIt.docs.map(doc =>({
        bookId:doc.id,
        ...doc.data()
      }))
      //console.log(doc.data);

      res.status(200).send(bookings);

    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  })

  router.post("/api/bookings", verifyToken(admin.auth()), async (req, res) => {
    const { title, description, facility, start, end, who } = req.body; // Add `who` to request body
    const uid = req.user.uid; 

    if (!title || !description || !facility || !start || !end || !who) {
      return res.status(400).json({ error: "All fields required" });
    }

    try {

      const newStart = admin.firestore.Timestamp.fromDate(new Date(start));
      const newEnd = admin.firestore.Timestamp.fromDate(new Date(end));

      const overlapping = await db.collection("bookings")
        .where("facility", "==", facility)
        .where("status", "==","Approved")
        .where("start", "<", newEnd)
        .where("end", ">", newStart)
        .get();

      if (!overlapping.empty) {
        return res.status(409).json({ error: "Booking conflict detected" });
      }

      await db.collection("bookings").add({
        title,
        description,
        facility,
        submittedBy: uid,
        status: "Pending",
        start: newStart,
        end: newEnd,
        who,
      });

      res.status(200).json({ message: "Booking submitted" });
    } catch (error) {
      console.error("Booking save error:", error);
      res.status(500).json({ error: "Failed to save Booking" });
    }
  });

  router.put('/api/booking-status/:id',async (req,res)=>{
    const bookId=req.params.id;

  try {
    const {status}=req.body;
    const getIt=  db.collection("bookings").doc(bookId);
    if (status!=""){
      await getIt.update({
        status:status
      })
      res.status(200).json({ message: `booking ${bookId} role updated to ${status}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
  })

  router.get('/api/get-bookings-per-month', async (req, res) => {
  try {
    const bookingsRef = db.collection("bookings");
    const snapshot = await bookingsRef.get();
    
    const monthlyCounts = new Array(12).fill(0);

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.start) {
        const date = data.start.toDate(); 
        const month = date.getMonth(); // 0 = January, 11 = December
        monthlyCounts[month]++;
      }
    });

    res.json(monthlyCounts);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ 
      error: "Failed to get bookings data",
      details: error.message 
    });
  }
  });

  router.get('/api/bookings-per-facility', async (req, res) => {
  const month = req.query.month; // Format: '2025-03'

  if (!month) return res.status(400).json({ error: 'Missing month param' });

  const startDate = new Date(`${month}-01T00:00:00Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const snapshot = await db.collection('bookings')
    .where('status', '==', 'Approved')
    .where('end', '>=', startDate)
    .where('end', '<', endDate)
    .get();

  const facilityCounts = {};

  snapshot.forEach(doc => {
    const facility = doc.get('facility') || 'Unknown';
    facilityCounts[facility] = (facilityCounts[facility] || 0) + 1;
  });

  res.json(facilityCounts);
  });

  return router;

};

export default createBookingsRouter;