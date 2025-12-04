'use client';

import { memo, useMemo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { ListTree as ListTreeIcon } from 'lucide-react';
import { SwitchDialog, type SwitchFormValues } from './dialog';
import { BaseHandle } from '@/components/react-flow/base-handle';

type SwitchNodeData = {
  discriminant?: string;
  cases?: string[];
  casesCsv?: string; // persisted raw if needed
};

type SwitchNodeType = Node<SwitchNodeData>;

export const SwitchNode = memo((props: NodeProps<SwitchNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: SwitchFormValues) => {
    const parsedCases = values.casesCsv
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              discriminant: values.discriminant,
              cases: parsedCases,
              casesCsv: values.casesCsv,
            },
          };
        }
        return node;
      })
    );
  };

  const nodeData = props.data;
  const cases = useMemo(() => nodeData?.cases || [], [nodeData]);
  const description = nodeData?.discriminant
    ? `Switch: ${nodeData.discriminant.slice(0, 50)}...`
    : 'Not configured';

  return (
    <>
      <SwitchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={{
          discriminant: nodeData?.discriminant,
          cases: nodeData?.cases,
          casesCsv: nodeData?.casesCsv,
        }}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={ListTreeIcon}
        name='Switch / Match'
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      >
        {cases.map((c) => (
          <BaseHandle key={c} id={c} type='source' position={Position.Right} />
        ))}
        <BaseHandle id='default' type='source' position={Position.Right} />
      </BaseExecutionNode>
    </>
  );
});

SwitchNode.displayName = 'SwitchNode';
