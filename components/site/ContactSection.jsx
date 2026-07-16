'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionHeader } from './SectionHeader';
import { IconRaven, IconScroll } from './MedievalIcons';

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
      toast.success('Raven dispatched! The rat will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Could not send. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
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
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          onSubmit={onSubmit}
          className="max-w-2xl mx-auto glass-panel frame-corners rounded-2xl p-8 md:p-12 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-300 uppercase text-[10px] tracking-[0.3em] font-cinzel">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sir Ratsalot"
                className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 h-12 transition-premium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300 uppercase text-[10px] tracking-[0.3em] font-cinzel">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="knight@darklands.com"
                className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 h-12 transition-premium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-neutral-300 uppercase text-[10px] tracking-[0.3em] font-cinzel">Subject</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Sponsorship / Collab / Fan Mail"
              className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 h-12 transition-premium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-neutral-300 uppercase text-[10px] tracking-[0.3em] font-cinzel">Message</Label>
            <Textarea
              id="message"
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell the rat what you need..."
              className="bg-black/60 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 resize-none transition-premium"
            />
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="text-red-500"><IconScroll size={20} /></span>
              <span>or email: <span className="text-neutral-300">contact@ratattack.gg</span></span>
            </div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 glow-red h-13 px-8 transition-premium"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> <span className="font-cinzel tracking-widest uppercase text-sm">Dispatching</span></>
              ) : (
                <><span className="mr-3"><IconRaven size={20} /></span><span className="font-cinzel tracking-widest uppercase text-sm">Send Raven</span></>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
