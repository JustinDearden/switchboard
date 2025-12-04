'use client';

import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { Repeat as RepeatIcon } from 'lucide-react';
import { ForEachDialog, type ForEachFormValues } from './dialog';
import { BaseHandle } from '@/components/react-flow/base-handle';

type ForEachNodeData = {
  arrayPath?: string;
  itemName?: string;
};

type ForEachNodeType = Node<ForEachNodeData>;

export const ForEachNode = memo((props: NodeProps<ForEachNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: ForEachFormValues) => {
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
  const description =
    nodeData?.arrayPath && nodeData?.itemName
      ? `For each ${nodeData.itemName} in ${nodeData.arrayPath.slice(0, 40)}...`
      : 'Not configured';

  return (
    <>
      <ForEachDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={RepeatIcon}
        name='For Each'
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        renderDefaultSourceHandle={false}
      >
        <BaseHandle
          id='each'
          type='source'
          position={Position.Right}
          style={{ top: '40%' }}
        />
        <BaseHandle
          id='done'
          type='source'
          position={Position.Right}
          style={{ top: '60%' }}
        />
      </BaseExecutionNode>
    </>
  );
});

ForEachNode.displayName = 'ForEachNode';
