import express from "express";
import {
    fetchNotifications,
    updatethereadingrowwithtimeandvalue,
    readallnotifications,
  } from "../api/notifications.js";

  import { fetchImpJobs, readjobforuser } from "../api/impjobnotifications.js";
import { StoringReminders, fetchReminders } from "../api/reminder.js";
import { setMail, fetchMail } from "../api/mail.js";



const router = express.Router();

router.post("/settimeandmail", async (req, res) => {
  try {
    const { email, passcode, hours, minutes, orgname, orgcode } = req.body;
    const settedmail = await setMail(
      email,
      passcode,
      hours,
      minutes,
      orgname,
      orgcode
    );
  } catch (error) {
    console.log(error);
  }
});

router.get("/gettimeandmail", async (req, res) => {
  try {
    const { orgname, orgcode } = req.query;
    const fetchedMail = await fetchMail(orgname, orgcode);
    res.json(fetchedMail);
  } catch (error) {
    console.log(error);
  }
});


//start of fetching notifications

router.get("/fetchnotifications", async (req, res) => {
  try {
    const { orgname, orgcode } = req.query;

    console.log("===== FETCH NOTIFICATIONS =====");
    console.log("Query:", req.query);
    console.log("orgname:", orgname);
    console.log("orgcode:", orgcode);

    const fetchednotifications = await fetchNotifications(orgname, orgcode);

    console.log("API Response:", fetchednotifications);

    if (!fetchednotifications) {
      console.log("fetchNotifications returned NULL/undefined");
      return res.status(500).json({
        message: "fetchNotifications returned undefined",
      });
    }

    console.log(
      "Notifications Count:",
      fetchednotifications.notifications
        ? fetchednotifications.notifications.length
        : 0
    );

    console.log(
      "Organizations Count:",
      fetchednotifications.organizations
        ? fetchednotifications.organizations.length
        : 0
    );

    if (
      fetchednotifications.notifications &&
      fetchednotifications.notifications.length > 0
    ) {
      console.log(
        "First Notification:",
        fetchednotifications.notifications[0]
      );
    }

    console.log("===============================");

    res.status(200).json(fetchednotifications);
  } catch (error) {
    console.error("FETCH NOTIFICATION ROUTE ERROR:");
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
      stack: error.stack,
    });
  }
});

//end of fetching notifications
// these commments are for future reference for debugging notifications



router.put("/userhasread", async (req, res) => {
  try {
    const {
      orgname,
      orgcode,
      address,
      clientname,
      country,
      state,
      city,
      postalcode,
      alias,
      pan,
      gst,
      iec,
      branchname,
      creditdays,
      username,
      id,
      reading,
      timeofreading,
    } = req.body.theitemread;
    const { currentDate, employeename } = req.body;
    const updatedReadRow = await updatethereadingrowwithtimeandvalue(
      orgname,
      orgcode,
      address,
      clientname,
      country,
      state,
      city,
      postalcode,
      alias,
      pan,
      gst,
      iec,
      branchname,
      creditdays,
      username,
      id,
      currentDate,
      reading,
      timeofreading,
      employeename
    );
    res.send(updatedReadRow); // Make sure updatedReadRow contains the updated row
  } catch (error) {
    console.log(error);
  }
});

router.put("/makereadall", async (req, res) => {
  try {
    const { currentDate, notifications } = req.body;
    const everythingread = await readallnotifications(
      currentDate,
      notifications
    );
    res.status(200).send(everythingread);
  } catch (error) {
    console.log(error);
  }
});


router.get("/fetchJobnotifications", async (req, res) => {
  try {
    const { orgname, orgcode, branchcode } = req.query;
    const fetchedjob = await fetchImpJobs(orgname, orgcode, branchcode);
    res.send(fetchedjob);
  } catch (error) {
    console.log(error);
  }
});

router.put("/userreadforjob", async (req, res) => {
  try {
    const { orgname, orgcode, username, jobnumber, branchcode, branchname } =
      req.body;
    const readedjob = await readjobforuser(
      orgname,
      orgcode,
      username,
      jobnumber,
      branchcode,
      branchname
    );
  } catch (error) {
    console.log(error);
  }
});

router.post("/insertreminder", async (req, res) => {
  try {
    const { jobnumber } = req.body;
    const storedreminders = await StoringReminders(
      req.body.reminders,
      jobnumber
    );

    res.status(200).send(storedreminders);
  } catch (error) {
    console.log(error);
  }
});

router.get("/fetchremindernotifications", async (req, res) => {
  try {
    const { orgname, orgcode, branchname } = req.query;
    const fetchedreminders = await fetchReminders(orgname, orgcode, branchname);
    res.send(fetchedreminders);
  } catch (error) {
    console.log(error);
  }
});




export default router
