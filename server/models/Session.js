const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const Movie = require("../models/Movie");

router.get("/", async (req, res) => {
  try {
    const {
      venue,
      date,
      format,
      language,
      timeOfDay,
      sort = "earliest",
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (date) query.date = date;
    if (venue) query.venue = { $in: venue.split(",") }; // e.g., ?venue=galleria,batumi
    if (format) query.format = { $in: format.split(",") };
    if (language) query.language = { $in: language.split(",") };

    if (timeOfDay) {
      const times = timeOfDay.split(",");

      query.$or = times.map((t) => {
        if (t === "morning") return { time: { $regex: /^([0-1][0-1]):/ } };
        if (t === "afternoon") return { time: { $regex: /^(1[2-7]):/ } };
        if (t === "evening") return { time: { $regex: /^(1[8-9]|2[0-3]):/ } };
        return {};
      });
    }

    let sortOption = {};
    if (sort === "earliest") sortOption = { time: 1 };
    if (sort === "latest") sortOption = { time: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sessions = await Session.find(query)
      .populate("movieId")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalSessions = await Session.countDocuments(query);

    res.status(200).json({
      total: totalSessions,
      page: parseInt(page),
      totalPages: Math.ceil(totalSessions / limit),
      sessions,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching sessions", error: err.message });
  }
});

module.exports = router;
