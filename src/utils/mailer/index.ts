import * as fs from 'fs'
import * as sgMail from '@sendgrid/mail'
import * as Handlebars from 'handlebars'
import { SENDGRID_API_KEY } from '@environment'
import { TemplateEmail } from '@common'

export class Mailer {
  async sendMail(
    template: TemplateEmail,
    subject: string,
    to: string[],
    replacement: any
  ) {
    const templateEmail = {
      GENERATE_PASSWORD: 'generatePassword.html'
    }
    fs.readFile(
      `src/assets/template/${templateEmail[template]}`,
      {
        encoding: 'utf8'
      },
      (err, data) => {
        if (err) {
          throw new Error(err.message)
        }
        const templateHandle = Handlebars.compile(data)
        const html = templateHandle({
          ...replacement
        })
        sgMail.setApiKey(SENDGRID_API_KEY)
        const mail = {
          from: 'hotro01.giadinh@gmail.com',
          to: to.toLocaleString(),
          subject,
          html
        }
        sgMail.send(mail)
      }
    )
  }
}
