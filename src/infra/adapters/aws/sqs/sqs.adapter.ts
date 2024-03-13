import { HttpException, Inject, Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';

@Injectable()
export class SQSAdapter {
  constructor(@Inject('sqs') private readonly sqs: SQS) {}
  async sendMessage(queue: any) {
    try {
      this.sqs.sendMessage(
        {
          MessageBody: queue.MessageBody,
          QueueUrl: queue.QueueUrl,
        },
        (err, _) => {
          if (err) {
            throw err;
          } else {
            console.log('sent to queue successfully');
          }
        },
      );
    } catch (error) {
      throw new HttpException(error?.Error || 'Internal Server Error', 500);
    }
  }
}
