import type { Customer } from '@voyado-kth/shared';

export interface DraftRuleMatch {
  id: string;
  field: string;
  operator: string;
  value: string;
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

function normalizeDateDifference(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return Number.NaN;
  }

  const today = new Date();
  const difference = today.getTime() - date.getTime();
  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

function matchesDraftRule(customer: Customer, rule: DraftRuleMatch) {
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
    default:
      return false;
  }
}

export function getMatchingDraftCustomers(customers: Customer[], rules: DraftRuleMatch[]) {
  const completeRules = rules.filter(
    (rule) => rule.field && rule.operator && rule.value.trim(),
  );

  if (completeRules.length === 0) {
    return [];
  }

  return customers.filter((customer) =>
    completeRules.every((rule) => matchesDraftRule(customer, rule)),
  );
}

export function formatDraftRuleLabel(rule: DraftRuleMatch) {
  const fieldLabels: Record<string, string> = {
    tier: 'Tier',
    city: 'City',
    totalSpend: 'Total spend',
    lastPurchaseDate: 'Last purchase',
    pointsBalance: 'Points',
  };

  const operatorLabels: Record<string, string> = {
    equals: 'equals',
    not_equals: 'is not',
    greater_than: 'above',
    less_than: 'below',
    contains: 'contains',
  };

  return `${fieldLabels[rule.field] ?? rule.field} ${operatorLabels[rule.operator] ?? rule.operator} ${rule.value}`;
}

export function formatHistoricalRuleLabel(field: string, operator: string, value: string | number) {
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

  if (operator === 'older_than_days' || operator === 'within_days') {
    return `${fieldLabels[field] ?? field} ${operatorLabels[operator]} ${value} days`;
  }

  return `${fieldLabels[field] ?? field} ${operatorLabels[operator] ?? operator} ${value}`;
}
