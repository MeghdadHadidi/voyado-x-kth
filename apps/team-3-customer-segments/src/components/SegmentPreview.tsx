import type { Customer } from '@voyado-kth/shared';
import { Alert, Badge, Card, Flex } from '@voyado-kth/ui';
import { formatDraftRuleLabel, type DraftRuleMatch } from '../lib/segmentMatching';
import styles from './SegmentPreview.module.css';

interface SegmentPreviewProps {
  rules: DraftRuleMatch[];
  matches: Customer[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(value);
}

function getTierVariant(tier: Customer['tier']) {
  switch (tier) {
    case 'Gold':
      return 'warning';
    case 'Platinum':
      return 'success';
    case 'Silver':
      return 'info';
    case 'Bronze':
    default:
      return 'neutral';
  }
}

export function SegmentPreview({ rules, matches }: SegmentPreviewProps) {
  const completeRules = rules.filter((rule) => rule.field && rule.operator && rule.value.trim());
  const previewRows = matches.slice(0, 5);

  return (
    <Card className={styles.card}>
      <Flex justify="space-between" align="center" wrap gap="var(--ess-spacing-300)">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Preview results</p>
          <h3 className={styles.title}>Audience feedback</h3>
        </div>
        <Badge variant="success">{matches.length} customers match</Badge>
      </Flex>

      <div className={styles.ruleList}>
        {completeRules.map((rule) => (
          <span key={rule.id} className={styles.ruleChip}>
            {formatDraftRuleLabel(rule)}
          </span>
        ))}
      </div>

      {matches.length === 0 ? (
        <Alert variant="warning" title="No customers matched">
          Try broadening your criteria or removing one of the filters.
        </Alert>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Tier</th>
                <th>City</th>
                <th>Total spend</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.firstName} {customer.lastName}</td>
                  <td>{customer.email}</td>
                  <td>
                    <Badge variant={getTierVariant(customer.tier)}>{customer.tier}</Badge>
                  </td>
                  <td>{customer.city}</td>
                  <td>{formatCurrency(customer.totalSpend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
