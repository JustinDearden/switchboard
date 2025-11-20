'use client';

import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { GitBranch as GitBranchIcon } from 'lucide-react';
import { IfElseDialog, type IfElseFormValues } from './dialog';
import { BaseHandle } from '@/components/react-flow/base-handle';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { IF_ELSE_CHANNEL_NAME } from '@/inngest/channels/if-else';
import { fetchIfElseRealtimeToken } from './actions';

type IfElseNodeData = {
  condition?: string;
};

type IfElseNodeType = Node<IfElseNodeData>;

export const IfElseNode = memo((props: NodeProps<IfElseNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: IF_ELSE_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchIfElseRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: IfElseFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  };

  const nodeData = props.data;
  const description = nodeData?.condition
    ? `If: ${nodeData.condition.slice(0, 50)}...
      }`
    : 'Not configured';

  return (
    <>
      <IfElseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GitBranchIcon}
        name='If / Else'
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        renderDefaultSourceHandle={false}
      >
        <BaseHandle
          id='true'
          type='source'
          position={Position.Right}
          style={{ top: '38%' }}
        />
        <BaseHandle
          id='false'
          type='source'
          position={Position.Right}
          style={{ top: '62%' }}
        />
      </BaseExecutionNode>
    </>
  );
});

IfElseNode.displayName = 'IfElseNode';
