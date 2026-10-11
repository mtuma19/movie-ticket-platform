const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    posterUrl: { type: String, required: true },
    backdropUrl: { type: String, required: true }, // Background image
    genres: [String],
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    mainActors: [String],
    formats: [String],
    ageRestriction: {
      rating: {
        type: String,
        enum: ["G", "PG", "12+", "16+", "18+"],
        default: "G",
      },
      explanation: { type: String, default: "" },
    },
    isComingSoon: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Movie", movieSchema);
