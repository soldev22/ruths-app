import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";

export async function POST(req: NextRequest) {
  try {
    const { caseId, studentName, teacherNotes, aiReport, sectionScores, flatAnswers } = await req.json();

    if (!caseId || !aiReport) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Clean up report text - remove dashes and extra formatting
    const cleanReport = aiReport
      .replace(/^-\s+/gm, '') // Remove dashes at start of lines
      .replace(/\s+-\s+/g, ' ') // Remove dashes between words
      .trim();

    // Split the AI report into paragraphs
    const reportLines = cleanReport.split("\n").filter((line: string) => line.trim());
    
    // Get current date
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const doc = new Document({
      sections: [
        // COVER PAGE
        {
          children: [
            // Spacer
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            
            // Main Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "Dyslexia Screening Report",
                  bold: true,
                  size: 48,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),
            
            // Subtitle
            new Paragraph({
              children: [
                new TextRun({
                  text: "Professional Assessment Summary",
                  size: 28,
                  font: "Arial",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 800 },
            }),
            
            // Divider line
            new Paragraph({
              children: [
                new TextRun({
                  text: "_______________________________________________",
                  color: "666666",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),
            
            // Student Name (if provided)
            ...(studentName
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Student: ${studentName}`,
                        size: 28,
                        font: "Arial",
                        bold: true,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                  }),
                ]
              : []),
            
            // Case ID
            new Paragraph({
              children: [
                new TextRun({
                  text: `Case ID: ${caseId}`,
                  size: 24,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            
            // Date
            new Paragraph({
              children: [
                new TextRun({
                  text: `Assessment Date: ${currentDate}`,
                  size: 24,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 800 },
            }),
            
            // Footer text
            new Paragraph({
              children: [
                new TextRun({
                  text: "SkillScan Professional Screening",
                  size: 22,
                  font: "Arial",
                  color: "666666",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
        
        // MAIN CONTENT PAGES
        {
          children: [
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "Dyslexia Screening Report",
                  bold: true,
                  size: 40,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Case ID
            new Paragraph({
              children: [
                new TextRun({
                  text: `Case ID: ${caseId}`,
                  bold: true,
                  size: 24,
                  font: "Arial",
                }),
              ],
              spacing: { after: 200 },
            }),

            // Student Name (if provided)
            ...(studentName
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Student: ${studentName}`,
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Teacher Notes (if provided)
            ...(teacherNotes
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Additional Notes:",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: teacherNotes,
                        size: 22,
                        italics: true,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 400 },
                  }),
                ]
              : []),

            // Report Content
            new Paragraph({
              children: [
                new TextRun({
                  text: "Assessment Summary",
                  bold: true,
                  size: 32,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),

            // Convert AI report text into paragraphs
            ...reportLines.map((line: string) => {
              // Check if this line is a section heading (all caps or ends with certain patterns)
              const isSectionHeading = 
                line === line.toUpperCase() && 
                line.length < 50 && 
                line.length > 3 &&
                !line.includes(':') &&
                !line.match(/^\d/); // Not starting with a number
              
              return new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: isSectionHeading ? 28 : 22,
                    bold: isSectionHeading,
                    font: "Arial",
                  }),
                ],
                spacing: { 
                  before: isSectionHeading ? 300 : 0,
                  after: isSectionHeading ? 200 : 200 
                },
              });
            }),

            // Questions and Answers Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Detailed Screening Responses",
                  bold: true,
                  size: 32,
                  font: "Arial",
                }),
              ],
              spacing: { before: 600, after: 300 },
            }),

            // Add sections with Q&A
            ...(flatAnswers && sectionScores ? 
              sectionScores.flatMap((section: any) => {
                const sectionAnswers = flatAnswers.filter(
                  (a: any) => a.sectionId === section.sectionId
                );
                
                return [
                  // Section heading
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: section.sectionId,
                        bold: true,
                        size: 28,
                        font: "Arial",
                      }),
                    ],
                    spacing: { before: 400, after: 200 },
                  }),
                  
                  // Section score
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Score: ${section.correct}/${section.total} (${section.percent}%)`,
                        size: 22,
                        italics: true,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 300 },
                  }),

                  // Questions and answers
                  ...sectionAnswers.flatMap((qa: any) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Q: ${qa.questionText}`,
                          bold: true,
                          size: 22,
                          font: "Arial",
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Student Answer: ${qa.answer}`,
                          size: 22,
                          font: "Arial",
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                    ...(qa.correctAnswer ? [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Correct Answer: ${Array.isArray(qa.correctAnswer) ? qa.correctAnswer.join(", ") : qa.correctAnswer}`,
                            size: 20,
                            color: "666666",
                            font: "Arial",
                          }),
                        ],
                        spacing: { after: 300 },
                      }),
                    ] : []),
                  ]),
                ];
              })
            : []),
          ],
        },
        
        // BACK PAGE
        {
          children: [
            // Spacer
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "Important Information",
                  bold: true,
                  size: 36,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),
            
            // Understanding This Report
            new Paragraph({
              children: [
                new TextRun({
                  text: "Understanding This Report",
                  bold: true,
                  size: 28,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "This screening report provides an assessment to help identify areas where additional support may be beneficial. The results can guide conversations between teachers and parents about next steps and appropriate interventions.",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 400 },
            }),
            
            // For Teachers
            new Paragraph({
              children: [
                new TextRun({
                  text: "For Teachers",
                  bold: true,
                  size: 28,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Use this report to plan targeted interventions and monitor progress. Consider the recommendations provided and adapt teaching strategies to support the student's individual learning needs.",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 400 },
            }),
            
            // For Parents
            new Paragraph({
              children: [
                new TextRun({
                  text: "For Parents",
                  bold: true,
                  size: 28,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "This report helps you understand your child's strengths and areas where they may need extra support. Discuss the findings with your child's teacher to develop a collaborative approach to supporting their learning journey.",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 400 },
            }),
            
            // Next Steps
            new Paragraph({
              children: [
                new TextRun({
                  text: "Next Steps",
                  bold: true,
                  size: 28,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "1. Review the recommendations and discuss as a team",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 200 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. Implement suggested strategies and monitor progress",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 200 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "3. If concerns continue, consider seeking additional specialist assessment",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 200 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "4. Maintain open communication between teachers, parents, and the student",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 600 },
            }),
            
            // Confidentiality
            new Paragraph({
              children: [
                new TextRun({
                  text: "Confidentiality Notice",
                  bold: true,
                  size: 24,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "This document contains confidential information about a student and should be handled in accordance with data protection regulations and your institution's confidentiality policies.",
                  size: 20,
                  font: "Arial",
                  color: "666666",
                }),
              ],
              spacing: { after: 600 },
            }),
            
            // Footer
            new Paragraph({
              children: [
                new TextRun({
                  text: `© ${new Date().getFullYear()} SkillScan Professional Screening`,
                  size: 20,
                  font: "Arial",
                  color: "999999",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
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
        "Content-Disposition": `attachment; filename=ai-screening-report-${caseId}.docx`,
      },
    });
  } catch (err) {
    console.error("AI Report Word export failed:", err);
    return NextResponse.json(
      { error: "AI Report Word export failed" },
      { status: 500 }
    );
  }
}
