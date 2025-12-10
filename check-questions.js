const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const QuestionSchema = new mongoose.Schema({
  screeningType: String,
  readingYear: String,
  section: String,
  text: String,
  options: [String],
  correctAnswer: String,
  order: Number,
  active: Boolean
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkQuestions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check S1 questions
    const s1Questions = await Question.find({ screeningType: 'dyslexia', readingYear: 'S1' }).limit(5);
    console.log('📝 Sample S1 Questions:');
    s1Questions.forEach(q => {
      console.log(`  - ${q.text.substring(0, 50)}...`);
      console.log(`    Has correctAnswer: ${!!q.correctAnswer}`);
      console.log(`    correctAnswer value: ${q.correctAnswer || 'MISSING'}\n`);
    });

    // Check S2 questions
    const s2Questions = await Question.find({ screeningType: 'dyslexia', readingYear: 'S2' }).limit(5);
    console.log('📝 Sample S2 Questions:');
    s2Questions.forEach(q => {
      console.log(`  - ${q.text.substring(0, 50)}...`);
      console.log(`    Has correctAnswer: ${!!q.correctAnswer}`);
      console.log(`    correctAnswer value: ${q.correctAnswer || 'MISSING'}\n`);
    });

    // Count questions without correctAnswer
    const missingCorrectAnswer = await Question.countDocuments({ 
      screeningType: 'dyslexia', 
      correctAnswer: { $exists: false } 
    });
    console.log(`\n⚠️  ${missingCorrectAnswer} questions missing correctAnswer field`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkQuestions();
