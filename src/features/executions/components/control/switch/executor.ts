import type { NodeExecutor } from '@/features/executions/types';
import Handlebars from 'handlebars';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type SwitchData = {
  discriminant?: string;
  cases?: string[];
};

export const switchExecutor: NodeExecutor<SwitchData> = async ({
  data,
  nodeId,
  context,
}) => {
  const tmpl = data.discriminant
    ? Handlebars.compile(data.discriminant)
    : undefined;
  const value = (tmpl ? tmpl(context) : '').toString();
  const cases = Array.isArray(data.cases) ? data.cases : [];
  const selected = cases.includes(value) ? value : 'default';

  return {
    ...context,
    __control: {
      ...(context.__control as Record<string, unknown>),
      [nodeId]: { type: 'switch', value, selected },
    },
  };
};
