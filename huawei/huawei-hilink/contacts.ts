import fs from 'fs';
import { restCalls } from './DefaultRestCalls';

async function readFileFile(filename: string) {
  return JSON.parse(await fs.promises.readFile(filename, 'utf-8'));
}

export async function readMessagesAndSendMessage(url: string,
  applicationId: string,
  applicationSecret: string,
  messageFile: string) {
  if (fs.existsSync(messageFile)) {
    const json = await readFileFile(messageFile);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < json.length; i++) {
      const message = json[i];
      await restCalls.fetchData(`${url}/${applicationId}/${applicationSecret}/sms?command=${encodeURIComponent(message.content[0])}`, 'GET');
      console.info(`message ${message.content[0]} from ${message.phone[0]} sent`);
    }
  }
}
