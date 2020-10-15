import { HttpService, Injectable } from "@nestjs/common";
import * as twilio from 'twilio';

@Injectable()
export class MessageService {
    private urlWhatsAppMessage = 'https://messages-sandbox.nexmo.com/v0.1/messages';

    constructor(
        private readonly httpService: HttpService
    ) { }

    sendWhatsAppMessage(to: string[], message: string) {
        to.forEach(phone => {
            this.httpService.post(this.urlWhatsAppMessage, {}, {
                auth: {
                    username: process.env.NEXMO_USER,
                    password: process.env.NEXMO_PASS,
                },
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json',
                },
                data: {
                    from: { type: 'whatsapp', number: process.env.NEXMO_FROM_NUMBER },
                    to: { type: 'whatsapp', number: phone },
                    message: {
                        content: {
                            type: 'text',
                            text: message,
                        }
                    }
                }
            }).toPromise()
                .then(() => console.log('WhatsApp enviado com sucesso!'))
                .catch(err => console.log('err', err));
        })
    }

    sendBulkSMSMessage(numbers: string[], message: string) {
        const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
        const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
        const PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
        const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

        numbers.forEach(number => {
            client.messages
                .create({ body: message, from: PHONE_NUMBER, to: `+55${number}` })
                .then(data => console.log('SMS enviado com sucesso'))
                .catch(err => console.log('err', err));
        });

    }
}