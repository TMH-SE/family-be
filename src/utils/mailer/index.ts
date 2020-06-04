import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import { GMAIL_USERNAME, GMAIL_PASSWORD } from '@environment'
import * as nodemailer from 'nodemailer'
import { TemplateEmail } from '@common'

export class Mailer {
  async sendMail(
    template: TemplateEmail,
    subject: string,
    to: string[],
    replacement: any
  ) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: GMAIL_USERNAME,
        pass: GMAIL_PASSWORD
      }
    })
    const templateEmail = {
      GENERATE_PASSWORD: 'generatePassword.html',
      VERIFY_ACCOUNT: 'verifyAccount.html'
    }
    fs.readFile(
      `src/assets/template/${templateEmail[template]}`,
      {
        encoding: 'utf8'
      },
      async (err, data) => {
        if (err) {
          throw new Error(err.message)
        }
        const templateHandle = Handlebars.compile(data)
        const html = templateHandle({
          ...replacement
        })
        const mailOptions = {
          from: 'hotro01.giadinh@gmail.com',
          to: to.toLocaleString(),
          subject,
          html
        }
        await transporter.sendMail(mailOptions)
      }
    )
  }
}
