// Migration script to populate historical activity logs from existing data
// Run this once to backfill activity logs from existing User and DyslexiaScreening records

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectToDatabase } from "../lib/db";
import User from "../models/User";
import { DyslexiaScreening } from "../models/DyslexiaScreening";
import ActivityLog from "../models/ActivityLog";

async function migrateHistoricalData() {
  console.log("Starting historical data migration...");
  
  try {
    await connectToDatabase();
    console.log("Connected to database");

    let totalCreated = 0;

    // 1. Migrate User Registrations
    console.log("\n📝 Migrating user registrations...");
    const users = await User.find({}).lean();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      // Check if registration log already exists
      const existingLog = await ActivityLog.findOne({
        userId: user._id,
        activityType: 'registration'
      });

      if (!existingLog) {
        await ActivityLog.create({
          userId: user._id,
          userEmail: user.email,
          activityType: 'registration',
          metadata: {
            accountType: user.accountType || 'individual',
            migrated: true
          },
          timestamp: user.createdAt || new Date()
        });
        totalCreated++;
        console.log(`✓ Created registration log for ${user.email}`);
      } else {
        console.log(`- Registration log already exists for ${user.email}`);
      }
    }

    // 2. Migrate Screening Starts
    console.log("\n🔍 Migrating screening starts...");
    const screenings = await DyslexiaScreening.find({}).lean();
    console.log(`Found ${screenings.length} screenings`);

    for (const screening of screenings) {
      // Find the user for this screening
      const user = await User.findById(screening.userId || screening.teacherId);
      
      if (!user) {
        console.log(`⚠ No user found for screening ${screening._id}, skipping`);
        continue;
      }

      // Check if screening start log already exists
      const existingLog = await ActivityLog.findOne({
        screeningId: screening._id,
        activityType: 'screening_started'
      });

      if (!existingLog) {
        await ActivityLog.create({
          userId: user._id,
          userEmail: user.email,
          activityType: 'screening_started',
          screeningId: screening._id,
          caseId: screening.caseId,
          metadata: {
            accountType: user.accountType,
            readingYear: screening.readingYear,
            migrated: true
          },
          timestamp: screening.createdAt || new Date()
        });
        totalCreated++;
        console.log(`✓ Created screening start log for ${user.email} - Case: ${screening.caseId}`);
      } else {
        console.log(`- Screening start log already exists for Case: ${screening.caseId}`);
      }

      // 3. Migrate Section Completions
      if (screening.sections && screening.sections.length > 0) {
        for (const section of screening.sections) {
          const existingSectionLog = await ActivityLog.findOne({
            screeningId: screening._id,
            sectionId: section.sectionId,
            activityType: 'screening_section_completed'
          });

          if (!existingSectionLog) {
            await ActivityLog.create({
              userId: user._id,
              userEmail: user.email,
              activityType: 'screening_section_completed',
              screeningId: screening._id,
              caseId: screening.caseId,
              sectionId: section.sectionId,
              metadata: {
                sectionsCompleted: screening.sections.length,
                readingYear: screening.readingYear,
                migrated: true
              },
              timestamp: screening.updatedAt || screening.createdAt || new Date()
            });
            totalCreated++;
            console.log(`  ✓ Created section log for ${section.sectionId}`);
          }
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Total activity logs created: ${totalCreated}`);
    console.log("=".repeat(60) + "\n");

    // Show summary stats
    const stats = await ActivityLog.aggregate([
      { $group: { _id: "$activityType", count: { $sum: 1 } } }
    ]);

    console.log("Activity Log Summary:");
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateHistoricalData()
  .then(() => {
    console.log("Migration script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });
