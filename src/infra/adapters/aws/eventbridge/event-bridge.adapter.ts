import { Inject, Injectable } from '@nestjs/common';
import { EventBridge } from 'aws-sdk';

@Injectable()
export class EventBridgeAdapter {
  constructor(
    @Inject('event-bridge') private readonly eventBridge: EventBridge,
  ) {}
  async createSchedule(campaign: any) {
    try {
      //marcar horario para colocar na fila (a fila ativa o lambda de notification)no createCampaign em internl-notification.service.ts
      // o event bridge ativa o createCampaignDisptcher em internal-notification.service.ts que colocar na fila
      //  a fila por sua vez ativa o sendCampaign do vapidNotification.service.ts
      const dateStart = new Date(campaign.dateStart).toISOString();
      this.eventBridge.putEvents(
        {
          Entries: [{}],
          EndpointId: '',
        },
        (err, _) => {
          if (err) {
            throw err;
          } else {
            console.log('schedule created successfully');
          }
        },
      );
    } catch (error) {
      console.error('Error on  EventBridge:', error);
    }
  }
}
