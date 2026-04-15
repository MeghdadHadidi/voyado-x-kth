import { useState } from 'react';
import type { Customer, Segment, SegmentRule } from '@voyado-kth/shared';
import { Alert, Badge, Button, Card, Flex, Grid, PageHeader } from '@voyado-kth/ui';
import customersData from '../../data/customers.json';
import segmentsData from '../../data/segments.json';
import teamData from '../../data/team.json';
import styles from './CustomerSegmentsPage.module.css';

type DemoOperator = SegmentRule['operator'] | 'older_than_days' | 'within_days';

interface DemoRule extends Omit<SegmentRule, 'operator'> {
  operator: DemoOperator;
}

interface DemoSegment extends Omit<Segment, 'rules'> {
  rules: DemoRule[];
}

const segments = [...(segmentsData as DemoSegment[])].sort(
  (left, right) => new Date(right.createdDate).getTime() - new Date(left.createdDate).getTime(),
);

const customers = customersData as Customer[];

const today = new Date();

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(value);
}

function getCustomerValue(customer: Customer, field: string): string | number | boolean | undefined {
  const record = customer as unknown as Record<string, unknown>;
  const value = record[field];

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined'
  ) {
    return value;
  }

  return undefined;
}

function getDaysDifference(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return Number.NaN;
  }

  const difference = today.getTime() - date.getTime();
  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

function matchesRule(customer: Customer, rule: DemoRule) {
  const actualValue = getCustomerValue(customer, rule.field);
  const normalizedRuleValue = String(rule.value).trim();

  switch (rule.operator) {
    case 'equals':
      return String(actualValue).toLowerCase() === normalizedRuleValue.toLowerCase();
    case 'not_equals':
      return String(actualValue).toLowerCase() !== normalizedRuleValue.toLowerCase();
    case 'greater_than':
      return Number(actualValue) > Number(normalizedRuleValue);
    case 'less_than':
      return Number(actualValue) < Number(normalizedRuleValue);
    case 'contains':
      return String(actualValue).toLowerCase().includes(normalizedRuleValue.toLowerCase());
    case 'in':
      return normalizedRuleValue
        .split(',')
        .map((entry) => entry.trim().toLowerCase())
        .includes(String(actualValue).toLowerCase());
    case 'older_than_days': {
      const difference = getDaysDifference(String(actualValue));
      return !Number.isNaN(difference) && difference > Number(normalizedRuleValue);
    }
    case 'within_days': {
      const difference = getDaysDifference(String(actualValue));
      return !Number.isNaN(difference) && difference <= Number(normalizedRuleValue);
    }
    default:
      return false;
  }
}

function getMatchingCustomers(segment: DemoSegment) {
  return customers.filter((customer) => segment.rules.every((rule) => matchesRule(customer, rule)));
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

function getRuleLabel(rule: DemoRule) {
  const fieldLabels: Record<string, string> = {
    tier: 'Tier',
    city: 'City',
    totalSpend: 'Total spend',
    lastPurchaseDate: 'Last purchase',
    enrollmentDate: 'Enrollment',
    isActive: 'Active',
    pointsBalance: 'Points',
  };

  const operatorLabels: Record<string, string> = {
    equals: 'equals',
    not_equals: 'is not',
    greater_than: 'above',
    less_than: 'below',
    contains: 'contains',
    in: 'is one of',
    older_than_days: 'older than',
    within_days: 'within',
  };

  if (rule.operator === 'older_than_days' || rule.operator === 'within_days') {
    return `${fieldLabels[rule.field] ?? rule.field} ${operatorLabels[rule.operator]} ${rule.value} days`;
  }

  return `${fieldLabels[rule.field] ?? rule.field} ${operatorLabels[rule.operator] ?? rule.operator} ${rule.value}`;
}

export function CustomerSegmentsPage() {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(segments[0]?.id ?? '');

  const selectedSegment = segments.find((segment) => segment.id === selectedSegmentId) ?? segments[0] ?? null;
  const matchingCustomers = selectedSegment ? getMatchingCustomers(selectedSegment) : [];

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.hero}>
        <PageHeader
          title="Customer Segments"
          subtitle="A minimal demo workspace for browsing seeded audiences and validating who matches each targeting rule."
        >
          <Flex gap="var(--ess-spacing-300)" wrap>
            <div className={styles.statusPill}>Demo-ready slice</div>
            <Button disabled variant="neutral">
              Create segment next
            </Button>
          </Flex>
        </PageHeader>

        <Grid
          columns="minmax(0, 1.5fr) minmax(18rem, 0.9fr)"
          gap="var(--ess-spacing-500)"
          className={styles.heroGrid}
        >
          <div className={styles.storyPanel}>
            <p className={styles.eyebrow}>Segment Builders</p>
            <h2 className={styles.storyTitle}>Browse, inspect, and explain the audience in one screen.</h2>
            <p className={styles.storyText}>
              This demo keeps the flow intentionally lean: marketers can move from the segment
              list into a detail panel and immediately see which customers match the seeded rules.
            </p>

            <Flex gap="var(--ess-spacing-300)" wrap className={styles.badgeRow}>
              <span className={styles.inlineBadge}>Segment list</span>
              <span className={styles.inlineBadge}>Detail panel</span>
              <span className={styles.inlineBadge}>Live customer matches</span>
            </Flex>
          </div>

          <aside className={styles.teamPanel} aria-label="Workshop team">
            <p className={styles.panelLabel}>Workshop crew</p>
            <h3 className={styles.teamName}>{teamData.teamName}</h3>
            <ul className={styles.memberList}>
              {teamData.members.map((member) => (
                <li key={member.id} className={styles.memberItem}>
                  <span
                    className={styles.memberInitial}
                    style={{ backgroundColor: member.color }}
                    aria-hidden="true"
                  >
                    {member.initials}
                  </span>
                  <div>
                    <p className={styles.memberName}>{member.name}</p>
                    <p className={styles.memberRole}>{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </Grid>
      </section>

      <Grid
        columns="minmax(19rem, 0.92fr) minmax(0, 1.48fr)"
        gap="var(--ess-spacing-500)"
        className={styles.workspace}
      >
        <section className={styles.sidebarStage} aria-labelledby="segment-library-title">
          <div className={styles.panelHeader}>
            <p className={styles.panelLabel}>Left rail</p>
            <h2 id="segment-library-title" className={styles.panelTitle}>
              Segment library
            </h2>
          </div>

          {segments.length === 0 ? (
            <Alert variant="info" title="No segments yet">
              Add your first segment once the create flow is implemented.
            </Alert>
          ) : (
            <div className={styles.segmentList}>
              {segments.map((segment) => {
                const isSelected = selectedSegment?.id === segment.id;

                return (
                  <button
                    key={segment.id}
                    type="button"
                    className={styles.segmentButton}
                    onClick={() => setSelectedSegmentId(segment.id)}
                  >
                    <Card className={[styles.segmentCard, isSelected ? styles.segmentCardSelected : ''].join(' ')} hoverable>
                      <div className={styles.segmentCardHeader}>
                        <p className={styles.mockMeta}>{formatDate(segment.createdDate)}</p>
                        <Badge>{segment.customerCount.toLocaleString('en-SE')}</Badge>
                      </div>
                      <h3 className={styles.mockTitle}>{segment.name}</h3>
                      <p className={styles.mockDescription}>{segment.description}</p>
                    </Card>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.canvasStage} aria-labelledby="canvas-title">
          {selectedSegment ? (
            <>
              <div className={styles.panelHeader}>
                <p className={styles.panelLabel}>Selected segment</p>
                <h2 id="canvas-title" className={styles.panelTitle}>
                  {selectedSegment.name}
                </h2>
              </div>

              <Card className={styles.canvasCard}>
                <Flex justify="space-between" align="center" wrap gap="var(--ess-spacing-300)">
                  <div>
                    <p className={styles.canvasKicker}>Read-only detail</p>
                    <h3 className={styles.canvasTitle}>{selectedSegment.description}</h3>
                  </div>
                  <Badge variant="info">{matchingCustomers.length} matched in demo data</Badge>
                </Flex>

                <div className={styles.ruleList}>
                  {selectedSegment.rules.map((rule) => (
                    <span key={rule.id} className={styles.ruleChip}>
                      {getRuleLabel(rule)}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className={styles.previewCard}>
                <Flex justify="space-between" align="center" wrap gap="var(--ess-spacing-300)">
                  <div>
                    <p className={styles.canvasKicker}>Matching customers</p>
                    <h3 className={styles.canvasTitle}>Audience preview</h3>
                  </div>
                  <Badge variant="success">{matchingCustomers.length} customers</Badge>
                </Flex>

                {matchingCustomers.length === 0 ? (
                  <Alert variant="warning" title="No customers matched">
                    This segment is still demo-safe, but the current sample data does not produce results for it.
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
                        {matchingCustomers.map((customer) => (
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
            </>
          ) : (
            <Alert variant="info" title="Select a segment">
              Pick a segment from the left to inspect the matching audience.
            </Alert>
          )}
        </section>
      </Grid>
    </main>
  );
}
