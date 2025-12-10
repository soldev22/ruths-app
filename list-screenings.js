require('dotenv').config({path:'.env.local'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const screenings = await mongoose.connection.db.collection('dyslexiascreenings')
    .find({})
    .sort({createdAt: -1})
    .limit(5)
    .toArray();
  
  console.log('Recent screenings:\n');
  screenings.forEach(s => {
    console.log(`Case ${s.caseId}:`);
    console.log(`  - Sections: ${s.sections.length}`);
    console.log(`  - ReadingYear: ${s.readingYear}`);
    console.log(`  - Created: ${s.createdAt}`);
    console.log('');
  });
  
  mongoose.connection.close();
});
