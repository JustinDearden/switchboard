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
  condition: z.string().min(1, { message: 'Condition is required' }),
});

export type IfElseFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<IfElseFormValues>;
}

export const IfElseDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: defaultValues.condition || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        condition: defaultValues.condition || '',
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>If / Else</DialogTitle>
          <DialogDescription>
            Enter a condition. You can interpolate variables using{' '}
            {'{{variable}}'}. The compiled result should be a boolean-like value
            (e.g. 'true', 'false', '1', '0').
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8 mt-4'
          >
            <FormField
              control={form.control}
              name='condition'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`{{httpResponse.status}} == 200`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be compiled with Handlebars. The result should
                    evaluate to true/false.
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
