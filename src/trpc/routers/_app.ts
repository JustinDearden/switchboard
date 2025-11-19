import { createTRPCRouter } from '../init';
import { workflowRouter } from '@/features/workflows/server/routers';
import { credentialRouter } from '@/features/credentials/server/routers';

export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
  credentials: credentialRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
