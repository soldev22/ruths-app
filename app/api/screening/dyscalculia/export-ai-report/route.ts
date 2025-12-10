import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

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
                  text: "Dyscalculia Assessment Report",
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
                  text: "Dyscalculia Assessment Report",
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

            // What To Do Next Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "What To Do Next",
                  bold: true,
                  size: 32,
                  font: "Arial",
                }),
              ],
              spacing: { before: 600, after: 300 },
            }),

            // Guidance based on risk level (determine from sectionScores)
            ...(() => {
              // Calculate overall score
              const totalCorrect = sectionScores?.reduce((sum: number, s: any) => sum + s.correct, 0) || 0;
              const totalQuestions = sectionScores?.reduce((sum: number, s: any) => sum + s.total, 0) || 1;
              const overallPercent = Math.round((totalCorrect / totalQuestions) * 100);
              const classification = overallPercent < 50 ? "High Risk" : overallPercent < 70 ? "Moderate Risk" : "Low Risk";

              if (classification === "High Risk") {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "1. Seek Professional Assessment",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Contact an educational psychologist for a comprehensive dyscalculia assessment. Typical cost: £300-800.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 250 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "2. Talk to School/Teacher",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Share these results with teachers. Request support like extra time, use of calculator, or math interventions.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 250 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "3. Support at Home",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "• Practice number bonds and times tables daily (5-10 mins)\n• Use visual aids: counters, number lines, blocks\n• Try math games and apps (make it fun!)\n• Break problems into smaller steps\n• Praise effort and perseverance",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 300 },
                  }),
                ];
              } else if (classification === "Moderate Risk") {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "1. Monitor Progress",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Keep track of math challenges. Re-screen in 6 months to check progress.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 250 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "2. Targeted Practice",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Focus on areas showing weakness (check section scores below). Use math games, flashcards, and visual tools.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 250 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "3. Talk to Teachers",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Inform teachers of specific challenges. Small accommodations (extra time, formula sheets) can help.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 300 },
                  }),
                ];
              } else {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "1. Continue Regular Practice",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Maintain good math habits. Practice mental math, explore number puzzles.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 250 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "2. If Struggles Persist...",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Consider other factors: attention difficulties (ADHD), anxiety, processing speed, or working memory challenges.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 250 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "3. Re-screen if Needed",
                        bold: true,
                        size: 24,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 150 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "If concerns arise later, you can re-screen to track changes over time.",
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 300 },
                  }),
                ];
              }
            })(),

            // Scoring Guide Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "How We Calculate Risk Levels",
                  bold: true,
                  size: 32,
                  font: "Arial",
                }),
              ],
              spacing: { before: 600, after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Risk Classification:",
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
                  text: "• High Risk: Below 50% overall score",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Moderate Risk: 50-69% overall score",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Low Risk: 70% or above overall score",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Section Scoring (RAG Rating):",
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
                  text: "Each section is color-coded based on performance:\n• RED: Significant difficulty (below 50%)\n• AMBER: Some concerns (50-69%)\n• GREEN: Age-appropriate performance (70%+)",
                  size: 22,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Screening Domains",
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
                  text: "Phonological Awareness: Measures the student's ability to recognize and manipulate the sound structures of language, including rhyming, syllable segmentation, and phoneme awareness.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Letter-Sound Knowledge: Assesses familiarity with the alphabetic principle and the student's ability to associate letters with their corresponding sounds.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Word Reading Fluency: Evaluates how quickly and accurately a student can decode and read individual words, an indicator of reading automaticity.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Reading Comprehension: Measures the student's understanding of text content and ability to extract meaning from written material.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Spelling and Writing: Assesses phonetic and orthographic knowledge through spelling tasks and written expression capabilities.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Score Interpretation",
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
                  text: "80-100: Proficient — Student demonstrates strong skills in this domain.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "60-79: Developing — Student is making progress but may benefit from targeted support.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "40-59: At-Risk — Student shows significant difficulty; intervention is recommended.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Below 40: High Risk — Immediate assessment and specialized intervention are strongly recommended.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 300 },
            }),

            // Questions and Answers Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Detailed Assessment Responses",
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
                  text: "This assessment report provides an evaluation to help identify areas where additional mathematical support may be beneficial. The results can guide conversations between teachers and parents about next steps and appropriate interventions.",
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
                  text: "Use this report to plan targeted mathematical interventions and monitor progress. Consider the recommendations provided and adapt teaching strategies to support the student's individual learning needs in numeracy.",
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
                  text: "This report helps you understand your child's mathematical strengths and areas where they may need extra support. Discuss the findings with your child's teacher to develop a collaborative approach to supporting their mathematical learning journey.",
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
        "Content-Disposition": `attachment; filename=ai-dyscalculia-report-${caseId}.docx`,
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
