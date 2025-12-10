require('dotenv').config({path:'.env.local'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB\n');
  
  const screening = await mongoose.connection.db.collection('dyslexiascreenings').findOne({caseId: '666017'});
  
  console.log('📋 Screening readingYear:', screening.readingYear);
  console.log('📋 Number of sections:', screening.sections.length);
  
  // Get first section
  const firstSection = screening.sections[0];
  console.log('\n🔍 First section:');
  console.log('  - sectionId:', firstSection.sectionId);
  console.log('  - Number of answers:', Object.keys(firstSection.answers).length);
  
  // Get first 3 question IDs
  const qIds = Object.keys(firstSection.answers).slice(0, 3);
  console.log('\n🔑 First 3 question IDs:', qIds);
  
  // Try to find these questions
  const questions = await mongoose.connection.db.collection('questions').find({
    _id: {$in: qIds.map(id => new mongoose.Types.ObjectId(id))}
  }).toArray();
  
  console.log('\n📖 Questions found:', questions.length);
  questions.forEach(q => {
    console.log(`  - ${q.text.substring(0, 60)}... (readingYear: ${q.readingYear})`);
  });
  
  // Check if there are S2 questions in the database
  const s2Count = await mongoose.connection.db.collection('questions').countDocuments({
    screeningType: 'dyslexia',
    readingYear: 'S2'
  });
  console.log(`\n📊 Total S2 questions in database: ${s2Count}`);
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
