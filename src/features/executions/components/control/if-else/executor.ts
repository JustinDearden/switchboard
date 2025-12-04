import type { NodeExecutor } from '@/features/executions/types';
import Handlebars from 'handlebars';
import { ifElseChannel } from '@/inngest/channels/if-else';
import { NonRetriableError } from 'inngest';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type IfElseData = {
  condition?: string;
};

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    if (normalized === '1') return true;
    if (normalized === '0') return false;
    // Fallback: non-empty → true
    return normalized.length > 0;
  }
  return Boolean(value);
}

export const ifElseExecutor: NodeExecutor<IfElseData> = async ({
  data,
  nodeId,
  context,
  publish,
}) => {
  await publish(
    ifElseChannel().status({
      nodeId,
      status: 'loading',
    })
  );

  if (!data.condition) {
    await publish(
      ifElseChannel().status({
        nodeId,
        status: 'error',
      })
    );
    throw new NonRetriableError('Condition not configured');
  }

  try {
    const tmpl = Handlebars.compile(data.condition);
    const compiled = tmpl(context);
    let selected: boolean = false;
    try {
      // Try parse JSON boolean if provided
      selected = toBoolean(JSON.parse(compiled));
    } catch {
      selected = toBoolean(compiled);
    }

    await publish(
      ifElseChannel().status({
        nodeId,
        status: 'success',
      })
    );

    return {
      ...context,
      __control: {
        ...(context.__control as Record<string, unknown>),
        [nodeId]: { type: 'if_else', selected: selected ? 'true' : 'false' },
      },
    };
  } catch (error) {
    await publish(
      ifElseChannel().status({
        nodeId,
        status: 'error',
      })
    );
    throw error;
  }
};
