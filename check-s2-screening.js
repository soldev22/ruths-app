require('dotenv').config({path:'.env.local'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  // Get the S2 screening (the one with data)
  const screening = await mongoose.connection.db.collection('dyslexiascreenings')
    .findOne({caseId: '666017', readingYear: 'S2'});
  
  console.log('✅ Found S2 Screening');
  console.log('_id:', screening._id);
  console.log('Sections:', screening.sections.length);
  console.log('');
  
  // Check first section
  const firstSection = screening.sections[0];
  console.log('First section ID:', firstSection.sectionId);
  console.log('Answers count:', Object.keys(firstSection.answers).length);
  
  // Get first 3 question IDs
  const qIds = Object.keys(firstSection.answers).slice(0, 3);
  console.log('\nFirst 3 question IDs:', qIds);
  
  // Try to find these questions
  const questions = await mongoose.connection.db.collection('questions').find({
    _id: {$in: qIds.map(id => new mongoose.Types.ObjectId(id))}
  }).toArray();
  
  console.log('\n📖 Questions found:', questions.length);
  questions.forEach(q => {
    console.log(`  - "${q.text.substring(0, 60)}..." (Year: ${q.readingYear})`);
  });
  
  mongoose.connection.close();
});
