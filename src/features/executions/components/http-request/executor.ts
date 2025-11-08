import type { NodeExecutor } from '@/features/executions/types';
import { NonRetriableError } from 'inngest';

type HttpRequestData = {
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish 'loading' state for http request

  if (!data.endpoint) {
    // TODO: Publish error state for http request
    throw new NonRetriableError('HTTP Request node: No endpoint configured');
  }

  const result = await step.run('http-request', async () => context);

  // TODO: Publish "success" state for http request

  return result;
};
