import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface EmailRequest {
  to: string
  subject: string
  content: string
  format: 'html'
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, format }: EmailRequest = await request.json()

    // Validate required fields
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, content' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Prepare HTML content and attachment
    const htmlContent = content
    const attachments: any[] = []

    // Create HTML file attachment
    const htmlBuffer = Buffer.from(content, 'utf-8')
    attachments.push({
      filename: 'mensaje.html',
      content: htmlBuffer,
      contentType: 'text/html'
    })

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Directorio SENA</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Nuevo mensaje recibido</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${htmlContent}
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 14px;"><em>El contenido también está disponible como archivo HTML adjunto.</em></p>
          </div>
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p>Este mensaje fue enviado desde el Directorio SENA</p>
          </div>
        </div>
      `,
      attachments: attachments
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}