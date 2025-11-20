import type { NodeExecutor } from '@/features/executions/types';
import Handlebars from 'handlebars';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type ForEachData = {
  arrayPath?: string;
  itemName?: string;
};

export const forEachExecutor: NodeExecutor<ForEachData> = async ({
  data,
  nodeId,
  context,
}) => {
  const tmpl = data.arrayPath ? Handlebars.compile(data.arrayPath) : undefined;
  const resolved = tmpl ? tmpl(context) : '[]';
  let arr: unknown[] = [];
  try {
    const maybeParsed = JSON.parse(resolved);
    if (Array.isArray(maybeParsed)) {
      arr = maybeParsed;
    } else if (typeof maybeParsed === 'string') {
      arr = [maybeParsed];
    }
  } catch {
    if (typeof resolved === 'string') {
      arr = resolved
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return {
    ...context,
    __control: {
      ...(context.__control as Record<string, unknown>),
      [nodeId]: {
        type: 'for_each',
        length: arr.length,
        itemName: data.itemName || 'item',
      },
    },
  };
};
