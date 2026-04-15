import type { SelectOption } from '@voyado-kth/ui';

export const ruleFieldOptions: SelectOption[] = [
  { value: 'tier', label: 'Tier' },
  { value: 'city', label: 'City' },
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'lastPurchaseDate', label: 'Last Purchase Date' },
  { value: 'pointsBalance', label: 'Points Balance' },
];

export const tierValueOptions: SelectOption[] = [
  { value: 'Bronze', label: 'Bronze' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Platinum', label: 'Platinum' },
];

export const operatorOptionsByField: Record<string, SelectOption[]> = {
  tier: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not equals' },
  ],
  city: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
  ],
  totalSpend: [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'equals', label: 'Equals' },
  ],
  lastPurchaseDate: [
    { value: 'greater_than', label: 'After date' },
    { value: 'less_than', label: 'Before date' },
  ],
  pointsBalance: [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'equals', label: 'Equals' },
  ],
};

export function getDefaultOperator(field: string) {
  return operatorOptionsByField[field]?.[0]?.value ?? '';
}

export function getValueInputType(field: string): 'text' | 'number' {
  if (field === 'totalSpend' || field === 'pointsBalance') {
    return 'number';
  }

  return 'text';
}
