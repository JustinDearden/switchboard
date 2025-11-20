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
  discriminant: z.string().min(1, { message: 'Discriminant is required' }),
  casesCsv: z.string().min(1, { message: 'At least one case is required' }),
});

export type SwitchFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SwitchFormValues) => void;
  defaultValues?: Partial<SwitchFormValues & { cases?: string[] }>;
}

export const SwitchDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<SwitchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discriminant: defaultValues.discriminant || '',
      casesCsv:
        (defaultValues as any).cases?.join(',') || defaultValues.casesCsv || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        discriminant: defaultValues.discriminant || '',
        casesCsv:
          (defaultValues as any).cases?.join(',') ||
          defaultValues.casesCsv ||
          '',
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: SwitchFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch / Match</DialogTitle>
          <DialogDescription>
            Provide a discriminant value (templated) and comma-separated cases.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8 mt-4'
          >
            <FormField
              control={form.control}
              name='discriminant'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discriminant</FormLabel>
                  <FormControl>
                    <Input placeholder={`{{order.type}}`} {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be compiled with Handlebars to a string.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='casesCsv'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cases (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder='buy,sell,hold' {...field} />
                  </FormControl>
                  <FormDescription>
                    A list of case labels. A default branch is available on the
                    node.
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
