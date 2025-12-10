import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyscalculiaScreening } from "../../../../../models/DyscalculiaScreening";
import Question from "../../../../../models/Question";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const caseId = formData.get("caseId")?.toString();
    const studentName = formData.get("studentName")?.toString() || "";
    const teacherNotes = formData.get("teacherNotes")?.toString() || "";

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    await connectToDatabase();

    const screening = await DyscalculiaScreening.findOne({ caseId }).lean();
    if (!screening) {
      return NextResponse.json({ error: "Screening not found" }, { status: 404 });
    }

    const questionIds = screening.sections.flatMap((s: { answers: Record<string, any> }) =>
      Object.keys(s.answers)
    );

    const questions = await Question.find({ _id: { $in: questionIds } }).lean();
    const questionLookup: Record<string, any> = {};
    questions.forEach((q) => {
      questionLookup[q._id.toString()] = q;
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Dyscalculia Assessment Report — Case ID: ${caseId}`,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: `Student Name: ${studentName}`,
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...(teacherNotes
              ? [
                  new Paragraph({
                    spacing: { after: 200 },
                    children: [
                      new TextRun({
                        text: "Teacher Notes:",
                        bold: true,
                        size: 24,
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { after: 400 },
                    children: [
                      new TextRun({
                        text: teacherNotes,
                        size: 22,
                        italics: true,
                      }),
                    ],
                  }),
                ]
              : []),

            ...screening.sections.flatMap(
              (section: { sectionId: string; answers: Record<string, any> }) => {
                return [
                  new Paragraph({
                    spacing: { after: 100 },
                    children: [
                      new TextRun({
                        text: `Section: ${section.sectionId}`,
                        bold: true,
                        size: 24,
                      }),
                    ],
                  }),
                  ...Object.entries(section.answers).map(([qId, ans]) => {
                    const question = questionLookup[qId];
                    return new Paragraph({
                      spacing: { after: 200 },
                      children: [
                        new TextRun({
                          text: `Q: ${question?.text || "Unknown"}`,
                          bold: true,
                        }),
                        new TextRun({
                          text: `\nA: ${ans}`,
                        }),
                      ],
                    });
                  }),
                ];
              }
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=dyscalculia-report-${caseId}.docx`,
      },
    });
  } catch (err) {
    console.error("Word export failed:", err);
    return NextResponse.json({ error: "Word export failed" }, { status: 500 });
  }
}
