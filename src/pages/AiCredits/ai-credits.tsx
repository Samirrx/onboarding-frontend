import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { notify } from '@/hooks/toastUtils';
import {
  fetchAiCreditBalances,
  grantAiCredits,
  setTenantAiEnabled
} from '@/services/controllers/onboarding';

/**
 * Credits are integers where 10,000 credits = 1 USD. That scale exists so a cheap AI turn stays
 * distinguishable from an expensive one; at a credit-per-dollar scale every ordinary turn rounds to
 * the same figure. Raw credits are what the API speaks, so they are what is shown, with the dollar
 * equivalent alongside rather than instead - one is exact, the other is readable.
 */
const CREDITS_PER_USD = 10000;

const formatCredits = (credits: number | null | undefined): string =>
  credits === null || credits === undefined ? '—' : credits.toLocaleString();

const formatUsd = (credits: number | null | undefined): string =>
  credits === null || credits === undefined
    ? ''
    : `$${(credits / CREDITS_PER_USD).toFixed(2)}`;

interface TenantCredit {
  tenantId: string;
  companyName: string | null;
  creditsGranted: number;
  creditsUsed: number;
  creditsRemaining: number;
  aiEnabled: boolean;
}

/**
 * Super-admin control over how much AI each tenant may spend.
 *
 * This is the only place credits are created. The app-builder service spends them and refuses when
 * they run out, but can never grant itself more - which is what keeps the commercial decision here
 * rather than inside a tenant's own workspace.
 *
 * Grants are additive and append-only: a revocation is a negative grant, not an edit, so the
 * history of what was given and taken back survives. The amount entered is therefore a change to
 * apply, never the new total - phrased in the dialog as such, because typing "50000" meaning "set
 * them to 50000" when they already hold 50000 would silently double it.
 */
const AiCredits: React.FC = () => {
  const [env, setEnv] = useState('dev');
  const [rows, setRows] = useState<TenantCredit[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [grantTarget, setGrantTarget] = useState<TenantCredit | null>(null);
  const [grantAmount, setGrantAmount] = useState('');
  const [grantNote, setGrantNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAiCreditBalances(env);
      // makeHttpCall never throws: a failure returns the same shape with status false and the HTTP
      // code in statusCode, so failures are detected here rather than in a catch.
      if (response?.statusCode === 403) {
        notify.error(
          'You do not have permission to manage AI credits. Ask a platform administrator to add you.'
        );
        setRows([]);
        return;
      }
      if (!response?.result) {
        notify.error(response?.message || 'Could not load AI credit balances');
        setRows([]);
        return;
      }
      setRows(response.result);
    } finally {
      setLoading(false);
    }
  }, [env]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (row) =>
        (row.companyName ?? '').toLowerCase().includes(term) ||
        row.tenantId.toLowerCase().includes(term)
    );
  }, [rows, search]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          granted: acc.granted + row.creditsGranted,
          used: acc.used + row.creditsUsed
        }),
        { granted: 0, used: 0 }
      ),
    [rows]
  );

  const submitGrant = async () => {
    if (!grantTarget) return;
    const credits = Number(grantAmount.trim());
    // Zero is rejected rather than accepted as a no-op: it is far likelier to be a slip than an
    // instruction, and the backend refuses it too.
    if (!Number.isInteger(credits) || credits === 0) {
      notify.error('Enter a non-zero whole number of credits.');
      return;
    }
    setSaving(true);
    try {
      const response = await grantAiCredits(grantTarget.tenantId, env, {
        credits,
        note: grantNote.trim() || null
      });
      if (!response?.result) {
        notify.error(response?.message || 'Could not update credits');
        return;
      }
      const updated: TenantCredit = response.result;
      setRows((current) =>
        current.map((row) => (row.tenantId === updated.tenantId ? updated : row))
      );
      notify.success(
        `${credits > 0 ? 'Granted' : 'Revoked'} ${formatCredits(Math.abs(credits))} credits for ${
          grantTarget.companyName ?? grantTarget.tenantId
        }.`
      );
      setGrantTarget(null);
      setGrantAmount('');
      setGrantNote('');
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (row: TenantCredit, aiEnabled: boolean) => {
    const response = await setTenantAiEnabled(row.tenantId, env, aiEnabled);
    if (!response?.result) {
      notify.error(response?.message || 'Could not change AI availability');
      return;
    }
    const updated: TenantCredit = response.result;
    setRows((current) =>
      current.map((item) => (item.tenantId === updated.tenantId ? updated : item))
    );
    notify.success(
      `AI ${aiEnabled ? 'enabled' : 'disabled'} for ${row.companyName ?? row.tenantId}.`
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">AI credits</h1>
        <p className="text-sm text-muted-foreground">
          How much AI usage each tenant has been granted, and how much they have spent.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={env} onValueChange={setEnv}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            {/* Each environment has its own registry; switching reloads against that one. */}
            <SelectItem value="dev">Dev</SelectItem>
            <SelectItem value="demo">Demo</SelectItem>
            <SelectItem value="preprod">Preprod</SelectItem>
            <SelectItem value="app">App</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by company or tenant id"
          className="max-w-xs"
        />
        <Button variant="outline" onClick={load} disabled={loading}>
          Refresh
        </Button>
        <div className="ml-auto text-sm text-muted-foreground">
          Granted {formatCredits(totals.granted)} ({formatUsd(totals.granted)}) · Used{' '}
          {formatCredits(totals.used)} ({formatUsd(totals.used)})
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead className="text-right">Granted</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead className="text-center">AI enabled</TableHead>
              <TableHead className="w-[140px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No tenants found for this environment.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.tenantId}>
                  <TableCell>
                    <div className="font-medium">{row.companyName ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{row.tenantId}</div>
                  </TableCell>
                  <TableCell className="text-right" title={formatUsd(row.creditsGranted)}>
                    {formatCredits(row.creditsGranted)}
                  </TableCell>
                  <TableCell className="text-right" title={formatUsd(row.creditsUsed)}>
                    {formatCredits(row.creditsUsed)}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Negative remaining is real and worth showing rather than clamping: a turn
                        can overshoot the balance, and an unfunded tenant shows spend against a zero
                        grant. Hiding it would hide exactly the tenants needing attention.

                        A tenant that has never been granted anything and never spent anything is
                        NOT exhausted - nothing was ever there to run out. Calling it exhausted
                        reads as "they burned through their credits" and points a super admin at
                        the wrong situation on the very screen where funding is decided. */}
                    <span
                      className={
                        row.creditsGranted > 0 && row.creditsRemaining <= 0
                          ? 'text-destructive font-medium'
                          : undefined
                      }
                      title={formatUsd(row.creditsRemaining)}
                    >
                      {formatCredits(row.creditsRemaining)}
                    </span>
                    {row.creditsGranted === 0 && row.creditsUsed === 0 && (
                      <Badge variant="secondary" className="ml-2">
                        Not funded
                      </Badge>
                    )}
                    {row.creditsGranted === 0 && row.creditsUsed > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        Unfunded usage
                      </Badge>
                    )}
                    {row.creditsGranted > 0 && row.creditsRemaining <= 0 && (
                      <Badge variant="destructive" className="ml-2">
                        Exhausted
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={row.aiEnabled}
                      onCheckedChange={(checked) => toggleEnabled(row, checked)}
                      aria-label={`AI enabled for ${row.companyName ?? row.tenantId}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => {
                        setGrantTarget(row);
                        setGrantAmount('');
                        setGrantNote('');
                      }}
                    >
                      Add credits
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!grantTarget} onOpenChange={(open) => !open && setGrantTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add credits — {grantTarget?.companyName ?? grantTarget?.tenantId}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Currently granted {formatCredits(grantTarget?.creditsGranted)} (
              {formatUsd(grantTarget?.creditsGranted)}), with{' '}
              {formatCredits(grantTarget?.creditsRemaining)} remaining.
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="grant-amount">
                Credits to add
              </label>
              <Input
                id="grant-amount"
                value={grantAmount}
                onChange={(event) => setGrantAmount(event.target.value)}
                placeholder="e.g. 500000"
                inputMode="numeric"
              />
              {/* Stated because the difference is silent and expensive: this adds to the balance,
                  it does not replace it. */}
              <p className="text-xs text-muted-foreground">
                This is added to what they already hold, not a new total. Use a negative number to
                take credits back. {grantAmount && Number(grantAmount)
                  ? `${formatUsd(Math.abs(Number(grantAmount)))} — new total ${formatCredits(
                      (grantTarget?.creditsGranted ?? 0) + Number(grantAmount)
                    )}.`
                  : ''}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="grant-note">
                Note (optional)
              </label>
              <Textarea
                id="grant-note"
                value={grantNote}
                onChange={(event) => setGrantNote(event.target.value)}
                placeholder="Why these credits were granted"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantTarget(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submitGrant} disabled={saving}>
              {saving ? 'Saving…' : 'Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AiCredits;
