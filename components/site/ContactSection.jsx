'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionHeader } from './SectionHeader';

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Message sent! The rat will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Could not send. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(220,38,38,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Send a Raven"
          title="Contact"
          description="Business inquiries, collab pitches, or just fan mail. Slide a message through the portcullis."
        />

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          onSubmit={onSubmit}
          className="max-w-2xl mx-auto glass-panel rounded-2xl p-6 md:p-10 space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-300 uppercase text-xs tracking-widest">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sir Ratsalot"
                className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300 uppercase text-xs tracking-widest">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="knight@darklands.com"
                className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-neutral-300 uppercase text-xs tracking-widest">Subject</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Sponsorship / Collab / Fan Mail"
              className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-neutral-300 uppercase text-xs tracking-widest">Message</Label>
            <Textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell the rat what you need..."
              className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Mail className="w-4 h-4 text-red-500" /> or email: <span className="text-neutral-300">contact@ratattack.gg</span>
            </div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 glow-red h-12 px-8"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Send Message</>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
