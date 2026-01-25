'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  arrayPath: z.string().min(1, { message: 'Array path is required' }),
  itemName: z
    .string()
    .min(1, { message: 'Item name is required' })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        'Item name must start with a letter or underscore and contain only letters, numbers, and underscores',
    }),
});

export type ForEachFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ForEachFormValues) => void;
  defaultValues?: Partial<ForEachFormValues>;
}

export const ForEachDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<ForEachFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arrayPath: defaultValues.arrayPath || '{{items}}',
      itemName: defaultValues.itemName || 'item',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        arrayPath: defaultValues.arrayPath || '{{items}}',
        itemName: defaultValues.itemName || 'item',
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: ForEachFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>For Each</DialogTitle>
          <DialogDescription>
            Select an array from context and an item variable name.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8 mt-4'
          >
            <FormField
              control={form.control}
              name='arrayPath'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Array</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='{{httpResponse.data.items}}'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Handlebars template that resolves to a JSON array string or
                    an array-like string.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='itemName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item variable name</FormLabel>
                  <FormControl>
                    <Input placeholder='item' {...field} />
                  </FormControl>
                  <FormDescription>
                    The variable name used within each iteration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='mt-4'>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
