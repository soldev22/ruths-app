import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import User from "../../../../models/User";
import { DyslexiaScreening } from "../../../../models/DyslexiaScreening";
import ActivityLog from "../../../../models/ActivityLog";

export async function POST() {
  try {
    await connectToDatabase();
    console.log("Starting historical data migration...");

    let totalCreated = 0;

    // 1. Migrate User Registrations
    console.log("Migrating user registrations...");
    const users = await User.find({}).lean();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
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
      }
    }

    // 2. Migrate Screening Starts and Sections
    console.log("Migrating screenings...");
    const screenings = await DyslexiaScreening.find({}).lean();
    console.log(`Found ${screenings.length} screenings`);

    for (const screening of screenings) {
      const userId = screening.userId || screening.teacherId;
      
      // Skip screenings with invalid user IDs
      if (!userId || userId === 'anonymous' || typeof userId === 'string') {
        console.log(`Skipping screening ${screening._id} - invalid user ID: ${userId}`);
        continue;
      }

      const user = await User.findById(userId);
      
      if (!user) {
        console.log(`Skipping screening ${screening._id} - user not found`);
        continue;
      }

      // Screening start
      const existingStartLog = await ActivityLog.findOne({
        screeningId: screening._id,
        activityType: 'screening_started'
      });

      if (!existingStartLog) {
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
      }

      // Section completions
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
          }
        }
      }
    }

    // Get summary stats
    const stats = await ActivityLog.aggregate([
      { $group: { _id: "$activityType", count: { $sum: 1 } } }
    ]);

    console.log("Migration completed successfully!");
    console.log(`Total activity logs created: ${totalCreated}`);

    return NextResponse.json({
      success: true,
      message: "Historical data migration completed",
      totalCreated,
      summary: stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });

  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      { error: "Migration failed", details: String(error) },
      { status: 500 }
    );
  }
}
