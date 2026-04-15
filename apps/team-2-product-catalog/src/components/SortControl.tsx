import { Select } from '@voyado-kth/ui';

const sortOptions = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'price-asc', label: 'Price low-high' },
  { value: 'price-desc', label: 'Price high-low' },
  { value: 'rating-desc', label: 'Rating highest' },
];

export interface SortControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <Select
      label="Sort products"
      value={value}
      options={sortOptions}
      onChange={event => onChange(event.target.value)}
    />
  );
}
