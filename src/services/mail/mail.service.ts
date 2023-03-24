import { readFileSync } from 'fs';
import { join } from 'path';

import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import { formatCurrency } from 'utils/formatCurrency';

import { ApproveDealerMailData, RejectDealerMailData, WinningBidMailData } from './types';

interface MailConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

interface MailAttachment {
  filename: string;
  path?: string;
}

interface MailData {
  receiver: string;
  subject: string;
  content: string;
  attachments?: MailAttachment[];
}

@Injectable()
export class MailService {
  constructor() {
    let mailConfig: MailConfig;
    if (process.env['NODE_ENV'] === 'production') {
      // all emails are delivered to destination
      mailConfig = {
        host: 'mail.1stdomains.co.nz',
        port: 587,
        auth: {
          user: 'dealers@gear.co.nz',
          pass: 'RandomMagic2022',
        },
      };
    } else {
      // all emails are catched by ethereal.email
      mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'chelsie18@ethereal.email',
          pass: '9pfWc71zC8BGBMUTDB',
        },
      };
    }
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  private transporter: nodemailer.Transporter;
  private logger = new Logger(MailService.name);

  async sendApproveDealerMail(receiver: string, data: ApproveDealerMailData) {
    const rawTemp = readFileSync(join(process.cwd(), '/src/services/mail/templates/dealer/approve.mjml'), 'utf-8');
    const compTemp = _.template(rawTemp)(data);
    const html = this.getMailTemplate(compTemp);
    await this.sendMail('dealer', {
      receiver,
      subject: '[Gear] Account approved',
      content: html,
      attachments: [],
    });
  }

  async sendRejectDealerMail(receiver: string, data: RejectDealerMailData) {
    const rawTemp = readFileSync(join(process.cwd(), '/src/services/mail/templates/dealer/reject.mjml'), 'utf-8');
    const compTemp = _.template(rawTemp)(data);
    const html = this.getMailTemplate(compTemp);
    await this.sendMail('dealer', {
      receiver,
      subject: '[Gear] Account denied',
      content: html,
      attachments: [],
    });
  }

  async sendWinningBidMail(receiver: string, data: WinningBidMailData) {
    const formattedData = {
      ...data,
      invoiceDate: data.invoiceDate.toLocaleDateString(),
      invoiceDueDate: data.invoiceDueDate.toLocaleDateString(),
      platformFee: formatCurrency(data.platformFee),
    };
    const rawTemp = readFileSync(join(process.cwd(), '/src/services/mail/templates/dealer/winBid.mjml'), 'utf-8');
    const compTemp = _.template(rawTemp)(formattedData);
    const html = this.getMailTemplate(compTemp);
    await this.sendMail('dealer', {
      receiver,
      subject: '[Gear] Congratulation on your won bid',
      content: html,
      attachments: [],
    });
  }

  private async sendMail(type: 'dealer' | 'seller', data: MailData) {
    try {
      const from = type === 'dealer' ? 'dealers@gear.co.nz' : 'hello@gear.co.nz';
      await this.transporter.sendMail({
        from,
        to: data.receiver,
        subject: data.subject,
        html: data.content,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  private getMailTemplate(mjmlTemplate: string): string {
    const data = mjml2html(mjmlTemplate, { minify: true });
    return data.html;
  }
}
