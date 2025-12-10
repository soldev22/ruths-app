require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  screeningType: String,
  readingYear: String,
  section: String,
  text: String,
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  order: Number,
  active: Boolean,
});

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

async function importQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const questions = require("./questions-dyscalculia-s4.json");

    // Delete existing S4 dyscalculia questions
    const deleteResult = await Question.deleteMany({
      screeningType: "dyscalculia",
      readingYear: "S4",
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing S4 dyscalculia questions`);

    // Insert new questions
    const result = await Question.insertMany(questions);
    console.log(`✅ Successfully imported ${result.length} questions for Dyscalculia S4`);

    // Verify by section
    const sections = await Question.aggregate([
      { $match: { screeningType: "dyscalculia", readingYear: "S4" } },
      { $group: { _id: "$section", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    console.log("\n📊 Questions per section:");
    sections.forEach((s) => {
      console.log(`   ${s._id}: ${s.count} questions`);
    });

    await mongoose.connection.close();
    console.log("\n✅ Import complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

importQuestions();
