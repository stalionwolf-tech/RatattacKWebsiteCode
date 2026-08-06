'use client';

import { useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import {
  Boxes,
  Database,
  Plus,
  Trash2,
  Save,
  Loader2,
  UploadCloud,
  ImageIcon,
  GripVertical,
  ExternalLink,
  ChevronLeft,
  X,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { compressImageToDataUrl } from '@/lib/image-compress';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'soldout', label: 'Sold Out' },
  { value: 'archived', label: 'Archived' },
];

const STATUS_STYLES = {
  draft: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  active: 'bg-emerald-950/70 text-emerald-300 border-emerald-800',
  soldout: 'bg-amber-950/70 text-amber-300 border-amber-800',
  archived: 'bg-red-950/70 text-red-300 border-red-800',
};

const fetcher = (url) => fetch(url).then((r) => r.json());

function emptyPack() {
  return {
    name: '',
    runId: '',
    status: 'draft',
    packArtwork: '',
    chaseImage: '',
    chaseName: '',
    chaseSet: '',
    chaseNumber: '',
    productionSize: '',
    chaseOdds: '',
    chaseValue: '',
    description: '',
    contents: [],
    faq: [],
    disclaimer: '',
    qrUrl: '',
    claimed: false,
    dateClaimed: '',
    winnerLocation: '',
  };
}

export function PackManager({ user = null }) {
  const { data, isLoading, mutate } = useSWR('/api/admin/packs', fetcher);
  const packs = data?.packs || [];
  const configError = data?.configError ? data.error : null;

  const [selectedId, setSelectedId] = useState(null); // null = nothing, 'new' = creating
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const activeCount = useMemo(
    () => packs.filter((p) => p.status === 'active').length,
    [packs],
  );

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const selectPack = (pack) => {
    setSelectedId(pack.id);
    setForm({ ...emptyPack(), ...pack });
  };

  const startNew = () => {
    setSelectedId('new');
    setForm(emptyPack());
  };

  const closeEditor = () => {
    setSelectedId(null);
    setForm(null);
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim()) {
      toast.error('Production Run Name is required.');
      return;
    }
    if (!form.runId.trim()) {
      toast.error('Production Run ID is required.');
      return;
    }
    setSaving(true);
    try {
      const isNew = selectedId === 'new';
      const res = await fetch(isNew ? '/api/admin/packs' : `/api/admin/packs/${selectedId}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        // Surface the exact failure category + recommended fix instead of a
        // generic "Save failed".
        const title = json?.category
          ? `Database error: ${json.category.replace(/_/g, ' ')}`
          : 'Save failed';
        const description = [json?.error, json?.recommendation]
          .filter(Boolean)
          .join(' — ') || `Request failed (${res.status})`;
        toast.error(title, { description });
        return;
      }
      toast.success(isNew ? 'Production run created.' : 'Production run saved.');
      await mutate();
      setSelectedId(json.pack.id);
      setForm({ ...emptyPack(), ...json.pack });
    } catch (e) {
      toast.error('Save failed', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (selectedId === 'new' || !selectedId) {
      closeEditor();
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/packs/${selectedId}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || `Request failed (${res.status})`);
      }
      toast.success('Production run deleted.');
      await mutate();
      closeEditor();
    } catch (e) {
      toast.error('Delete failed', { description: e.message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-neutral-800/70 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-950/60 border border-red-800/60">
            <Boxes className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-white tracking-wide">
              Mystery Pack Manager
            </h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              Create and manage every RatAttacK production run
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:inline-flex h-10 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950/60 px-3 text-[11px] font-cinzel uppercase tracking-widest text-neutral-200 transition-colors hover:border-red-700 hover:bg-red-950/30"
            >
              <ChevronLeft className="h-4 w-4" /> Inventory
            </Link>
            <Link
              href="/admin/diagnostics"
              className="hidden sm:inline-flex h-10 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950/60 px-3 text-[11px] font-cinzel uppercase tracking-widest text-neutral-200 transition-colors hover:border-red-700 hover:bg-red-950/30"
            >
              <Database className="h-4 w-4" /> Diagnostics
            </Link>
            <Link
              href="/mystery-pack"
              target="_blank"
              className="hidden sm:inline-flex h-10 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950/60 px-3 text-[11px] font-cinzel uppercase tracking-widest text-neutral-200 transition-colors hover:border-red-700 hover:bg-red-950/30"
            >
              <ExternalLink className="h-4 w-4" /> Live Page
            </Link>
            <SignOutButton className="h-10 gap-2 border-neutral-700 bg-neutral-950/60 hover:border-red-700 hover:bg-red-950/30" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8">
        {configError ? (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-1">
              <p className="font-cinzel uppercase tracking-widest text-red-300">
                Database not configured
              </p>
              <p>{configError}</p>
            </div>
          </div>
        ) : null}

        {activeCount > 1 ? (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-800/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {activeCount} runs are marked <strong>Active</strong>. The public page shows the most
              recently released active run — set the others to Sold Out or Archived to avoid
              confusion.
            </span>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Runs list */}
          <aside className="space-y-4">
            <Button
              onClick={startNew}
              className="w-full gap-2 bg-red-700 font-cinzel uppercase tracking-widest hover:bg-red-600"
            >
              <Plus className="h-4 w-4" /> New Production Run
            </Button>

            <Card className="border-neutral-800 bg-neutral-950/50 p-2">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading runs…
                </div>
              ) : packs.length === 0 ? (
                <p className="py-10 text-center text-sm text-neutral-500">No production runs yet.</p>
              ) : (
                <ScrollArea className="max-h-[70vh]">
                  <ul className="space-y-1.5 p-1">
                    {packs.map((pack) => {
                      const isSel = pack.id === selectedId;
                      return (
                        <li key={pack.id}>
                          <button
                            type="button"
                            onClick={() => selectPack(pack)}
                            className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                              isSel
                                ? 'border-red-700 bg-red-950/30'
                                : 'border-neutral-800 bg-black/30 hover:border-neutral-700 hover:bg-neutral-900/50'
                            }`}
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-black">
                              {pack.packArtwork ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={pack.packArtwork || '/placeholder.svg'}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-neutral-700">
                                  <ImageIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-neutral-100">
                                {pack.name}
                              </p>
                              <p className="truncate text-xs text-neutral-500">{pack.runId}</p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                                STATUS_STYLES[pack.status] || STATUS_STYLES.draft
                              }`}
                            >
                              {STATUS_OPTIONS.find((s) => s.value === pack.status)?.label ||
                                pack.status}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              )}
            </Card>
          </aside>

          {/* Editor */}
          <section>
            {form ? (
              <PackEditor
                form={form}
                set={set}
                setForm={setForm}
                isNew={selectedId === 'new'}
                saving={saving}
                deleting={deleting}
                onSave={handleSave}
                onDelete={handleDelete}
                onClose={closeEditor}
              />
            ) : (
              <Card className="flex min-h-[400px] flex-col items-center justify-center gap-3 border-dashed border-neutral-800 bg-neutral-950/40 p-10 text-center">
                <Boxes className="h-10 w-10 text-neutral-700" />
                <p className="font-cinzel text-lg text-neutral-300">Select a production run</p>
                <p className="max-w-sm text-sm text-neutral-500">
                  Choose a run from the list to edit it, or create a new production run. Everything
                  you enter here drives the live Mystery Pack page.
                </p>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-[0.14em] text-neutral-400">{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <Card className="border-neutral-800 bg-neutral-950/50 p-5 md:p-6">
      <div className="mb-4">
        <h3 className="font-cinzel text-lg text-white">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-neutral-500">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}

function ImageUploadField({ label, value, onChange, aspect = 'portrait' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await compressImageToDataUrl(file, { maxDim: 1200, quality: 0.85 });
      onChange(dataUrl);
    } catch (e) {
      toast.error('Image upload failed', { description: e.message });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Field label={label} hint="Uploads are compressed and stored with the run.">
      <div className="flex items-start gap-4">
        <div
          className={`relative overflow-hidden rounded-lg border border-neutral-800 bg-black ${
            aspect === 'portrait' ? 'h-40 w-28' : 'h-28 w-40'
          }`}
        >
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value || '/placeholder.svg'} alt={label} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-neutral-300 hover:text-white"
                aria-label={`Remove ${label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-neutral-700">
              <ImageIcon className="h-6 w-6" />
              <span className="text-[10px] uppercase tracking-wider">No image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="gap-2 border-neutral-700 bg-neutral-950/60 hover:border-red-700 hover:bg-red-950/30"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {value ? 'Replace image' : 'Upload image'}
          </Button>
        </div>
      </div>
    </Field>
  );
}

function PackEditor({ form, set, setForm, isNew, saving, deleting, onSave, onDelete, onClose }) {
  /* Contents list handlers */
  const updateContent = (i, val) =>
    setForm((f) => {
      const contents = [...f.contents];
      contents[i] = val;
      return { ...f, contents };
    });
  const addContent = () => setForm((f) => ({ ...f, contents: [...f.contents, ''] }));
  const removeContent = (i) =>
    setForm((f) => ({ ...f, contents: f.contents.filter((_, idx) => idx !== i) }));

  /* FAQ list handlers */
  const updateFaq = (i, key, val) =>
    setForm((f) => {
      const faq = [...f.faq];
      faq[i] = { ...faq[i], [key]: val };
      return { ...f, faq };
    });
  const addFaq = () => setForm((f) => ({ ...f, faq: [...f.faq, { q: '', a: '' }] }));
  const removeFaq = (i) =>
    setForm((f) => ({ ...f, faq: f.faq.filter((_, idx) => idx !== i) }));

  const inputCls = 'border-neutral-800 bg-black/40';

  return (
    <div className="space-y-6">
      {/* Editor action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-cinzel text-xl text-white">
          {isNew ? 'New Production Run' : form.name || 'Edit Production Run'}
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            Cancel
          </Button>
          {!isNew ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={deleting}
                  className="gap-2 border-red-900/60 bg-red-950/20 text-red-300 hover:bg-red-950/50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-neutral-800 bg-neutral-950">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-cinzel">Delete this production run?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes “{form.name}” ({form.runId}) and its artwork. This
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-neutral-700 bg-transparent">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-red-700 hover:bg-red-600"
                  >
                    Delete run
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          <Button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="gap-2 bg-red-700 font-cinzel uppercase tracking-widest hover:bg-red-600"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isNew ? 'Create run' : 'Save changes'}
          </Button>
        </div>
      </div>

      {/* Run details */}
      <SectionCard title="Run Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Production Run Name">
            <Input
              className={inputCls}
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="RatAttacK Mystery Pack"
            />
          </Field>
          <Field label="Production Run ID">
            <Input
              className={inputCls}
              value={form.runId}
              onChange={(e) => set({ runId: e.target.value })}
              placeholder="RMP-2026-001"
            />
          </Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => set({ status: v })}>
              <SelectTrigger className={inputCls}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Production Size">
            <Input
              className={inputCls}
              value={form.productionSize}
              onChange={(e) => set({ productionSize: e.target.value })}
              placeholder="500 Packs"
            />
          </Field>
        </div>
      </SectionCard>

      {/* Artwork */}
      <SectionCard title="Artwork" description="Pack artwork drives the hero and archive thumbnails.">
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageUploadField
            label="Pack Artwork"
            value={form.packArtwork}
            onChange={(v) => set({ packArtwork: v })}
            aspect="portrait"
          />
          <ImageUploadField
            label="Featured Chase Card Image"
            value={form.chaseImage}
            onChange={(v) => set({ chaseImage: v })}
            aspect="portrait"
          />
        </div>
      </SectionCard>

      {/* Featured chase */}
      <SectionCard title="Featured Chase Card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Featured Chase Card Name">
            <Input
              className={inputCls}
              value={form.chaseName}
              onChange={(e) => set({ chaseName: e.target.value })}
              placeholder="Charizard"
            />
          </Field>
          <Field label="Featured Chase Card Set">
            <Input
              className={inputCls}
              value={form.chaseSet}
              onChange={(e) => set({ chaseSet: e.target.value })}
              placeholder="Base Set"
            />
          </Field>
          <Field label="Featured Chase Card Number">
            <Input
              className={inputCls}
              value={form.chaseNumber}
              onChange={(e) => set({ chaseNumber: e.target.value })}
              placeholder="4/102"
            />
          </Field>
          <Field label="Chase Odds">
            <Input
              className={inputCls}
              value={form.chaseOdds}
              onChange={(e) => set({ chaseOdds: e.target.value })}
              placeholder="1 in 500"
            />
          </Field>
          <Field label="Estimated Chase Value">
            <Input
              className={inputCls}
              value={form.chaseValue}
              onChange={(e) => set({ chaseValue: e.target.value })}
              placeholder="$5,000+"
            />
          </Field>
        </div>
      </SectionCard>

      {/* Description */}
      <SectionCard title="Pack Description">
        <Textarea
          className={`${inputCls} min-h-[110px]`}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="Describe this production run…"
        />
      </SectionCard>

      {/* Pack contents */}
      <SectionCard title="Pack Contents" description="Each line becomes a bullet on the live page.">
        <div className="space-y-2">
          {form.contents.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 shrink-0 text-neutral-700" />
              <Input
                className={inputCls}
                value={c}
                onChange={(e) => updateContent(i, e.target.value)}
                placeholder="e.g. 1x Sealed RatAttacK Mystery Pack"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeContent(i)}
                className="shrink-0 text-neutral-500 hover:text-red-400"
                aria-label="Remove content line"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addContent}
            className="mt-1 gap-2 border-neutral-700 bg-neutral-950/60 hover:border-red-700 hover:bg-red-950/30"
          >
            <Plus className="h-4 w-4" /> Add content line
          </Button>
        </div>
      </SectionCard>

      {/* FAQ */}
      <SectionCard title="FAQ" description="Question / answer pairs rendered as an accordion.">
        <div className="space-y-4">
          {form.faq.map((item, i) => (
            <div key={i} className="rounded-lg border border-neutral-800 bg-black/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-neutral-500">
                  Question {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFaq(i)}
                  className="h-7 w-7 text-neutral-500 hover:text-red-400"
                  aria-label="Remove FAQ"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  className={inputCls}
                  value={item.q}
                  onChange={(e) => updateFaq(i, 'q', e.target.value)}
                  placeholder="Question"
                />
                <Textarea
                  className={inputCls}
                  value={item.a}
                  onChange={(e) => updateFaq(i, 'a', e.target.value)}
                  placeholder="Answer"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addFaq}
            className="gap-2 border-neutral-700 bg-neutral-950/60 hover:border-red-700 hover:bg-red-950/30"
          >
            <Plus className="h-4 w-4" /> Add FAQ
          </Button>
        </div>
      </SectionCard>

      {/* Legal + QR */}
      <SectionCard title="Legal & QR">
        <div className="space-y-4">
          <Field label="Legal Disclaimer">
            <Textarea
              className={`${inputCls} min-h-[90px]`}
              value={form.disclaimer}
              onChange={(e) => set({ disclaimer: e.target.value })}
              placeholder="Legal disclaimer text…"
            />
          </Field>
          <Field label="QR URL" hint="A QR code is generated automatically from this URL.">
            <Input
              className={inputCls}
              value={form.qrUrl}
              onChange={(e) => set({ qrUrl: e.target.value })}
              placeholder="https://ratattack.gg/mystery-pack"
            />
          </Field>
        </div>
      </SectionCard>

      {/* Claimed status */}
      <SectionCard title="Chase Status">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-black/30 p-4">
            <div>
              <p className="text-sm font-medium text-neutral-100">Chase card claimed</p>
              <p className="text-xs text-neutral-500">
                Toggle on once the featured chase has been pulled and verified.
              </p>
            </div>
            <Switch checked={form.claimed} onCheckedChange={(v) => set({ claimed: v })} />
          </div>
          {form.claimed ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date Claimed">
                <Input
                  type="date"
                  className={inputCls}
                  value={form.dateClaimed}
                  onChange={(e) => set({ dateClaimed: e.target.value })}
                />
              </Field>
              <Field label="Winner Location (optional)">
                <Input
                  className={inputCls}
                  value={form.winnerLocation}
                  onChange={(e) => set({ winnerLocation: e.target.value })}
                  placeholder="Ohio, USA"
                />
              </Field>
            </div>
          ) : null}
        </div>
      </SectionCard>

      <Separator className="bg-neutral-800" />

      <div className="flex justify-end gap-2 pb-4">
        <Button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="gap-2 bg-red-700 font-cinzel uppercase tracking-widest hover:bg-red-600"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isNew ? 'Create run' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
