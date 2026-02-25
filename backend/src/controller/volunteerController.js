import VolunteerRequest from "../model/VolunteerRequest.js";
import User from "../model/User.js";


// 1️⃣ Citizen sends volunteer request
export const sendVolunteerRequest = async (req, res) => {
  // console.log("Volunteer API HIT");
  // console.log("User:", req.user);
  // console.log("Body:", req.body);
  try {
    const citizenId = req.user.id; // from auth middleware
    const { ngoId } = req.body;

    const ngo = await User.findById(ngoId);
    if (!ngo || ngo.role !== "ngo") {
      return res.status(404).json({ message: "NGO not found" });
    }

    // prevent duplicate request
    const existing = await VolunteerRequest.findOne({
      citizen: citizenId,
      ngo: ngoId,
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = await VolunteerRequest.create({
      citizen: citizenId,
      ngo: ngoId,
    });

    res.status(201).json({
      message: "Volunteer request sent",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 2️⃣ NGO sees all requests
export const getNgoRequests = async (req, res) => {
  try {
    const ngoId = req.user.id;

    const requests = await VolunteerRequest.find({ ngo: ngoId })
      .populate("citizen", "name email mobileno");

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 3️⃣ NGO Accept / Reject request
export const updateRequestStatus = async (req, res) => {
  try {
    const { Id } = req.params;
    const { status } = req.body; // accepted / rejected

    const request = await VolunteerRequest.findById(Id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: `Request ${status}`,
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};