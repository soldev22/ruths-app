// app/api/screening/dyslexia/export-word/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
import Question from "../../../../../models/Question";

// DOCX imports MUST come from "docx" only — no namespace usage.
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export async function GET(req: NextRequest) {
  try {
    const caseId = req.nextUrl.searchParams.get("caseId");
    const notes = req.nextUrl.searchParams.get("notes") || "";
    const studentName = req.nextUrl.searchParams.get("studentName") || "";

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    await connectToDatabase();

    // --------------------------------------------------------------------
    // LOAD SCREENING
    // --------------------------------------------------------------------
    const screening = await DyslexiaScreening.findOne({ caseId }).lean();
    if (!screening) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // --------------------------------------------------------------------
    // LOAD QUESTION TEXTS
    // --------------------------------------------------------------------
    const allQuestionIds = screening.sections.flatMap((section: any) =>
      Object.keys(section.answers)
    );

    const questions = await Question.find({
      _id: { $in: allQuestionIds },
    }).lean();

    const questionLookup: Record<string, string> = {};
    questions.forEach((q: any) => {
      questionLookup[q._id.toString()] = q.text;
    });

    // --------------------------------------------------------------------
    // BUILD DOC CONTENT
    // --------------------------------------------------------------------
    const docElements: Paragraph[] = [];

    // Title
    docElements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Dyslexia Screening Report",
            bold: true,
            size: 36,
          }),
        ],
      })
    );

    // Case ID + Student Name
    docElements.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Case ID: ${caseId}`, bold: true }),
        ],
      })
    );

    if (studentName.trim().length > 0) {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Student Name: ${studentName}`, bold: true }),
          ],
        })
      );
    }

    docElements.push(new Paragraph(" "));

    // Teacher Notes
    if (notes.trim().length > 0) {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Teacher Notes:",
              bold: true,
              size: 28,
            }),
          ],
        })
      );

      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: notes,
            }),
          ],
        })
      );

      docElements.push(new Paragraph(" "));
    }

    // --------------------------------------------------------------------
    // SECTION-BY-SECTION
    // --------------------------------------------------------------------
    screening.sections.forEach((section: any) => {
      // Section heading
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.sectionId,
              bold: true,
              size: 28,
            }),
          ],
        })
      );

      docElements.push(new Paragraph(" "));

      // Q & A inside section
      Object.entries(section.answers).forEach(([questionId, answer]) => {
        const questionText = questionLookup[questionId] || "(Question deleted)";

        docElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${questionText}: `,
                bold: true,
              }),
              new TextRun({
                text: String(answer),
              }),
            ],
          })
        );
      });

      docElements.push(new Paragraph(" "));
    });

    // --------------------------------------------------------------------
    // BUILD FINAL DOC
    // --------------------------------------------------------------------
    const doc = new Document({
      sections: [{ children: docElements }],
    });

    const buffer = await Packer.toBuffer(doc);

   return new NextResponse(new Uint8Array(buffer),  {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="dyslexia-report-${caseId}.docx"`,
      },
    });
  } catch (err) {
    console.error("DOCX EXPORT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
