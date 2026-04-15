import { Alert, Button, Card, Input } from '@voyado-kth/ui';
import styles from './SegmentCreateForm.module.css';

export interface SegmentDraftValues {
  name: string;
  description: string;
}

interface SegmentCreateFormProps {
  values: SegmentDraftValues;
  nameError?: string;
  onChange: (field: keyof SegmentDraftValues, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function SegmentCreateForm({
  values,
  nameError,
  onChange,
  onCancel,
  onSubmit,
}: SegmentCreateFormProps) {
  const isValid = values.name.trim().length >= 3;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Create segment</p>
        <h3 className={styles.title}>Start with the basics</h3>
        <p className={styles.description}>
          Name the audience and add a short description before moving into rule setup.
        </p>
      </div>

      {nameError ? (
        <Alert variant="warning" title="Name needs a little more detail">
          Segment names must be at least 3 characters long.
        </Alert>
      ) : null}

      <div className={styles.fields}>
        <Input
          label="Segment Name"
          placeholder="Example: High-value Stockholm members"
          value={values.name}
          error={nameError}
          onChange={(event) => onChange('name', event.target.value)}
        />

        <Input
          label="Description"
          placeholder="Example: Gold and Platinum customers in Stockholm"
          value={values.description}
          onChange={(event) => onChange('description', event.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <Button variant="neutral" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!isValid}>
          Next: Add Rules
        </Button>
      </div>
    </Card>
  );
}
