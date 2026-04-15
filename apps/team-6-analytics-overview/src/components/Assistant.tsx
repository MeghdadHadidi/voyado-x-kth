import { useEffect, useMemo, useRef, useState } from 'react';
import type { RangeKey } from '../data/mock';
import styles from './Assistant.module.css';

type Ctx = {
  rangeLabel: string;
  revenueValue: string;
  revenueDelta: string;
  topCampaign: string;
  topRoas: string;
  topRoasValue: string;
  retention: string;
  pausedCount: number;
};

type NodeDef = {
  assistant: (ctx: Ctx) => string;
  chips?: { label: string; value: string }[];
  options: { label: string; next: string }[];
};

type Msg =
  | { id: number; role: 'assistant'; text: string; chips?: { label: string; value: string }[] }
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'typing' };

const CONVO: Record<string, NodeDef> = {
  root: {
    assistant: ctx => `Hi — I'm Clyde, your commerce intelligence assistant. I've reviewed the ${ctx.rangeLabel} window. Where shall we start?`,
    options: [
      { label: 'What drove revenue this period?', next: 'revenue' },
      { label: 'Which campaigns need attention?', next: 'campaigns' },
      { label: 'Retention drivers', next: 'retention' },
      { label: 'Anomalies worth flagging', next: 'anomalies' },
      { label: 'Give me a board-ready summary', next: 'board' },
    ],
  },
  revenue: {
    assistant: ctx => `Revenue landed at ${ctx.revenueValue} (${ctx.revenueDelta} vs prior). Direct-to-consumer did most of the lifting, and ${ctx.topCampaign} was the largest single contributor.`,
    chips: [
      { label: 'Top channel', value: 'Direct / Web' },
      { label: 'Leading campaign', value: 'See detail panel' },
    ],
    options: [
      { label: 'Break down by channel', next: 'revenueChannels' },
      { label: 'Which campaign contributed most?', next: 'topCampaign' },
      { label: 'Back to start', next: 'root' },
    ],
  },
  revenueChannels: {
    assistant: () => 'Direct / Web leads at roughly 42% of revenue, retail stores at 28%, marketplaces at 18%, and wholesale at 12%. The DTC share keeps climbing across windows.',
    options: [
      { label: 'What should I watch?', next: 'watchList' },
      { label: 'Back', next: 'revenue' },
    ],
  },
  topCampaign: {
    assistant: ctx => `${ctx.topCampaign} is the revenue leader this window. For pure efficiency, ${ctx.topRoas} is strongest at ${ctx.topRoasValue} ROAS on a smaller base.`,
    options: [
      { label: 'Should I scale it?', next: 'scale' },
      { label: 'Back', next: 'revenue' },
    ],
  },
  campaigns: {
    assistant: ctx => ctx.pausedCount > 0
      ? `There ${ctx.pausedCount === 1 ? 'is' : 'are'} ${ctx.pausedCount} paused campaign${ctx.pausedCount === 1 ? '' : 's'} worth reviewing. Low Frequency Pulse remains the clearest underperformer.`
      : 'Nothing is critical. The watch-list is Low Frequency Pulse for ROAS pressure and Signal Boost 12/04 for rising CPC.',
    options: [
      { label: 'What should I pause?', next: 'pause' },
      { label: 'What should I scale?', next: 'scale' },
      { label: 'Back to start', next: 'root' },
    ],
  },
  pause: {
    assistant: () => 'I would pause Low Frequency Pulse first. ROAS is below the floor and the creative has gone stale.',
    options: [
      { label: 'Draft a pause memo', next: 'memo' },
      { label: 'Back', next: 'campaigns' },
    ],
  },
  scale: {
    assistant: ctx => `${ctx.topRoas} is the cleanest scale candidate. It has headroom, but expect diminishing returns beyond roughly a 30% budget uplift.`,
    options: [
      { label: 'How much budget can it absorb?', next: 'budget' },
      { label: 'Back', next: 'campaigns' },
    ],
  },
  budget: {
    assistant: () => 'Roughly +30% before CPM inflects. Beyond that, you start buying the next-best audience and returns soften materially.',
    options: [{ label: 'Back to start', next: 'root' }],
  },
  retention: {
    assistant: ctx => `Rolling retention is at ${ctx.retention}. Most of the delta is driven by Loyalty Tier II, with win-back flows as the next biggest lever.`,
    options: [
      { label: 'Where should I invest next?', next: 'retentionInvest' },
      { label: 'Back to start', next: 'root' },
    ],
  },
  retentionInvest: {
    assistant: () => 'Push near-tier members over the Tier II threshold. The incremental cost is low and the retention step-change is the best ROI on the board.',
    options: [{ label: 'Back to start', next: 'root' }],
  },
  anomalies: {
    assistant: () => 'Three signals stand out: non-brand search CPC is up, reactivated cohorts are ahead of forecast, and wholesale remains flat while DTC accelerates.',
    options: [
      { label: 'Give me the exec summary', next: 'board' },
      { label: 'Back to start', next: 'root' },
    ],
  },
  watchList: {
    assistant: () => 'Monitor non-brand search CPC and flat wholesale revenue. Neither is urgent, but both belong in the next operating review.',
    options: [{ label: 'Back', next: 'revenue' }],
  },
  memo: {
    assistant: () => 'Drafting: "Pausing Low Frequency Pulse effective immediately due to sub-floor ROAS across consecutive windows. Creative refresh planned for next cycle."',
    options: [{ label: 'Back', next: 'campaigns' }],
  },
  board: {
    assistant: ctx => `Board summary: revenue ${ctx.revenueValue} (${ctx.revenueDelta}); retention ${ctx.retention}; ${ctx.topCampaign} led the window; one campaign is paused pending refresh; no material risks.`,
    options: [
      { label: 'Expand on retention', next: 'retention' },
      { label: 'Expand on campaigns', next: 'campaigns' },
      { label: 'Back to start', next: 'root' },
    ],
  },
};

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" className={styles.sparkles}>
      <path d="M12 3 L13.6 9.4 L20 11 L13.6 12.6 L12 19 L10.4 12.6 L4 11 L10.4 9.4 Z" fill="currentColor" />
      <path d="M19 3 L19.7 5.3 L22 6 L19.7 6.7 L19 9 L18.3 6.7 L16 6 L18.3 5.3 Z" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={styles.icon}>
      <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={styles.icon}>
      <path d="M3 10 L17 3 L13 17 L11 11 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type AssistantCtx = {
  range: RangeKey;
  rangeLabel: string;
  revenueValue: string;
  revenueDelta: number;
  topCampaignName: string;
  topRoasName: string;
  topRoasValue: number;
  retentionValue: string;
  pausedCount: number;
};

function buildCtx(src: AssistantCtx): Ctx {
  return {
    rangeLabel: src.rangeLabel,
    revenueValue: src.revenueValue,
    revenueDelta: `${src.revenueDelta >= 0 ? '+' : ''}${src.revenueDelta.toFixed(1)}%`,
    topCampaign: src.topCampaignName,
    topRoas: src.topRoasName,
    topRoasValue: `${src.topRoasValue.toFixed(1)}x`,
    retention: src.retentionValue,
    pausedCount: src.pausedCount,
  };
}

export function Assistant({ ctx }: { ctx: AssistantCtx }) {
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState('root');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);
  const built = useMemo(() => buildCtx(ctx), [ctx]);
  const node = CONVO[nodeId] ?? CONVO.root;

  useEffect(() => {
    if (!open) {
      return;
    }
    setNodeId('root');
    setMsgs([{ id: ++idRef.current, role: 'assistant', text: CONVO.root.assistant(built), chips: CONVO.root.chips }]);
  }, [open, built.rangeLabel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const pick = (option: { label: string; next: string }) => {
    if (busy) {
      return;
    }
    setBusy(true);
    const next = CONVO[option.next] ?? CONVO.root;
    setMsgs(current => [
      ...current,
      { id: ++idRef.current, role: 'user', text: option.label },
      { id: ++idRef.current, role: 'typing' },
    ]);
    setNodeId(option.next);
    window.setTimeout(() => {
      setMsgs(current => [
        ...current.filter(item => item.role !== 'typing'),
        { id: ++idRef.current, role: 'assistant', text: next.assistant(built), chips: next.chips },
      ]);
      setBusy(false);
    }, 650);
  };

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} aria-label="Open Clyde assistant" className={styles.launcher}>
          <span className={styles.launcherIcon}><SparklesIcon /></span>
          Ask Clyde
          <span className={styles.pulse} />
        </button>
      )}

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Clyde assistant">
          <div className={styles.panelHeader}>
            <div className={styles.headerIdentity}>
              <div className={styles.avatar}>
                <SparklesIcon />
                <span className={styles.statusDot} />
              </div>
              <div className={styles.headerText}>
                <strong>Clyde</strong>
                <span>Commerce intelligence · {ctx.rangeLabel}</span>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className={styles.closeButton}>
              <CloseIcon />
            </button>
          </div>

          <div ref={scrollRef} className={styles.messages}>
            {msgs.map(msg => {
              if (msg.role === 'assistant') {
                return (
                  <div key={msg.id} className={styles.assistantRow}>
                    <div className={styles.assistantAvatar}><SparklesIcon /></div>
                    <div className={styles.assistantBubble}>
                      {msg.text}
                      {msg.chips && (
                        <div className={styles.chipRow}>
                          {msg.chips.map(chip => (
                            <span key={chip.label} className={styles.chip}>
                              <span>{chip.label}:</span>
                              <strong>{chip.value}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className={styles.userRow}>
                    <div className={styles.userBubble}>{msg.text}</div>
                  </div>
                );
              }
              return (
                <div key={msg.id} className={styles.assistantRow}>
                  <div className={styles.assistantAvatar}><SparklesIcon /></div>
                  <div className={styles.typingBubble}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.options}>
            <div className={styles.optionsHeading}>Suggested</div>
            <div className={styles.optionList}>
              {node.options.map(option => (
                <button key={option.label} type="button" disabled={busy} onClick={() => pick(option)} className={styles.optionButton}>
                  <span>{option.label}</span>
                  <SendIcon />
                </button>
              ))}
            </div>
            <div className={styles.footnote}>Clyde only answers from scripted scenarios in this demo.</div>
          </div>
        </div>
      )}
    </>
  );
}
