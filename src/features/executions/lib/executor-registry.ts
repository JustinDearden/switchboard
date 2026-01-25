import { NodeType } from '@/generated/prisma';
import { NodeExecutor } from '../types';
import { manualTriggerExecutor } from '@/features/triggers/components/manual-trigger/executor';
import { httpRequestExecutor } from '../components/http-request/executor';
import { googleFormTriggerExecutor } from '@/features/triggers/components/google-form-trigger/executor';
import { stripeTriggerExecutor } from '@/features/triggers/components/stripe-trigger/executor';
import { geminiExecutor } from '../components/gemini/executor';
import { openaiExecutor } from '../components/openai/executor';
import { anthropicExecutor } from '../components/anthropic/executor';
import { discordExecutor } from '../components/discord/executor';
import { slackExecutor } from '../components/slack/executor';
import { ifElseExecutor } from '../components/control/if-else/executor';
import { switchExecutor } from '../components/control/switch/executor';
import { forEachExecutor } from '../components/control/for-each/executor';

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openaiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.SLACK]: slackExecutor,
  [NodeType.IF]: ifElseExecutor,
  [NodeType.SWITCH]: switchExecutor,
  [NodeType.FOR_EACH]: forEachExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
