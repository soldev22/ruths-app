const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Question Schema
const QuestionSchema = new mongoose.Schema({
  screeningType: { type: String, required: true },
  readingYear: { type: String, required: false },
  section: { type: String, required: true },
  text: { type: String, required: true },
  options: { type: [String], default: [] },
  correctAnswer: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function importQuestions() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read JSON file
    const filePath = path.join(__dirname, 'questions-s2.json');
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`📝 Found ${questions.length} questions to import`);

    // Insert questions
    const result = await Question.insertMany(questions);
    
    console.log(`✅ Successfully imported ${result.length} questions for S2`);
    console.log('📊 Sections:', [...new Set(questions.map(q => q.section))].join(', '));

  } catch (error) {
    console.error('❌ Error importing questions:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Connection closed');
  }
}

importQuestions();
