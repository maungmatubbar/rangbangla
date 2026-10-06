import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

export function NewsletterForm({ className }: Props) {
    const [email, setEmail] = useState('');

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!email.trim()) return;
        toast.success(
            'Thanks for subscribing! Look out for our festive drops.',
        );
        setEmail('');
    };

    return (
        <form
            onSubmit={submit}
            className={cn('flex w-full max-w-sm gap-2', className)}
        >
            <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="bg-background"
            />
            <Button type="submit" className="btn-lime shrink-0 gap-1.5">
                Subscribe
                <Send className="size-4" />
            </Button>
        </form>
    );
}
