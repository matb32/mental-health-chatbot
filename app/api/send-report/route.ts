import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateGPReport } from '@/utils/report-generator';

export async function POST(req: NextRequest) {
  try {
    const { assessment, results, recipientEmail } = await req.json();

    if (!assessment || !results || !recipientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail
    // NOTE: You need to set up App Password in Gmail for this to work
    // See: https://support.google.com/accounts/answer/185833
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
      },
    });

    // Generate the report
    const reportContent = generateGPReport(assessment, results);

    // Send email
    await transporter.sendMail({
      from: `"ADHD Assessment Tool" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Your ADHD Assessment Report',
      text: `Dear ${assessment.personalInfo.fullName},

Thank you for completing the Adult ADHD Assessment.

Your comprehensive GP referral report is attached to this email. Please save this report and bring it to your GP appointment when discussing ADHD assessment and potential specialist referral.

Important Notes:
- This assessment is a screening tool and does not constitute a clinical diagnosis
- Please consult with your GP or qualified healthcare professional for proper evaluation
- Keep this report confidential as it contains your personal health information

Next Steps:
1. Review your report thoroughly
2. Book an appointment with your GP
3. Discuss the results and request a specialist referral if appropriate

If you have any questions, please consult with your healthcare provider.

Best regards,
ADHD Assessment Tool Team
`,
      attachments: [
        {
          filename: `ADHD-Assessment-${assessment.personalInfo.fullName.replace(/\s/g, '-')}.txt`,
          content: reportContent,
          contentType: 'text/plain',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
