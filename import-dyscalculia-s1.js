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

    // Read the dyscalculia S1 questions file
    const questions = JSON.parse(fs.readFileSync('questions-dyscalculia-s1.json', 'utf8'));
    
    console.log(`📚 Found ${questions.length} Dyscalculia S1 questions to import\n`);

    // Delete existing dyscalculia S1 questions
    const deleteResult = await Question.deleteMany({ 
      screeningType: 'dyscalculia', 
      readingYear: 'S1' 
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing Dyscalculia S1 questions\n`);

    // Import new questions
    const result = await Question.insertMany(questions);
    console.log(`✅ Successfully imported ${result.length} questions for Dyscalculia S1\n`);

    // Verify by section
    const sections = [...new Set(questions.map(q => q.section))];
    console.log('📊 Questions by section:');
    for (const section of sections) {
      const count = await Question.countDocuments({ 
        screeningType: 'dyscalculia', 
        readingYear: 'S1',
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
