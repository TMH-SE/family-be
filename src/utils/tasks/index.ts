import { CronJob } from 'cron'
import { ReportResolver } from '@resolvers'

export class CronTasks {
  refreshTask() {
    const reportResolver = new ReportResolver()
    const job = new CronJob('0 0 * * * *', () => {
      reportResolver.refreshDataReport()
    }, null, false, 'Asia/Ho_Chi_Minh')
    job.start()
  }
}