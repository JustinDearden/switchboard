import { createTRPCRouter } from '../init';
import { workflowRouter } from '@/features/workflows/server/routers';
import { credentialRouter } from '@/features/credentials/server/routers';
import { executionRouter } from '@/features/executions/server/routers';

export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
  credentials: credentialRouter,
  executions: executionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
