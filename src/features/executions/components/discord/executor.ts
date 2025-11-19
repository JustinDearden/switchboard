import type { NodeExecutor } from '@/features/executions/types';
import { decode } from 'html-entities';
import { NonRetriableError } from 'inngest';
import Handlebars from 'handlebars';
import { discordChannel } from '@/inngest/channels/discord';
import axios from 'axios';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: 'loading',
    })
  );

  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: 'error',
      })
    );

    throw new NonRetriableError('Discord node: Content is missing');
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run('discord-webhook', async () => {
      if (!data.webhookUrl) {
        await publish(
          discordChannel().status({
            nodeId,
            status: 'error',
          })
        );

        throw new NonRetriableError('Discord node: Webhook URL is missing');
      }

      await axios.post(data.webhookUrl!, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });

      if (!data.variableName) {
        await publish(
          discordChannel().status({
            nodeId,
            status: 'error',
          })
        );

        throw new NonRetriableError('Discord node: Variable name is missing');
      }

      return {
        ...oncontextlost,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: 'success',
      })
    );

    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: 'error',
      })
    );

    throw error;
  }
};
