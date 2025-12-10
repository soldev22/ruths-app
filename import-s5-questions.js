require('dotenv').config({path:'.env.local'});
const mongoose = require('mongoose');
const fs = require('fs');

const questionSchema = new mongoose.Schema({
  screeningType: String,
  readingYear: String,
  section: String,
  text: String,
  options: [String],
  correctAnswer: String,
  order: Number,
  active: Boolean
});

const Question = mongoose.model('Question', questionSchema);

async function importQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Read the S5 questions file
    const questions = JSON.parse(fs.readFileSync('questions-s5.json', 'utf8'));
    
    console.log(`📚 Found ${questions.length} S5 questions to import\n`);

    // Delete existing S5 questions
    const deleteResult = await Question.deleteMany({ 
      screeningType: 'dyslexia', 
      readingYear: 'S5' 
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing S5 questions\n`);

    // Import new questions
    const result = await Question.insertMany(questions);
    console.log(`✅ Successfully imported ${result.length} questions for S5\n`);

    // Verify by section
    const sections = [...new Set(questions.map(q => q.section))];
    console.log('📊 Questions by section:');
    for (const section of sections) {
      const count = await Question.countDocuments({ 
        screeningType: 'dyslexia', 
        readingYear: 'S5',
        section 
      });
      console.log(`   ${section}: ${count} questions`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Import complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importQuestions();
