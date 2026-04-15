import type { SelectOption } from '@voyado-kth/ui';
import { Alert, Button, Card, Chip, Input, Select } from '@voyado-kth/ui';
import { getDefaultOperator, getValueInputType, operatorOptionsByField, ruleFieldOptions, tierValueOptions } from '../lib/ruleBuilderOptions';
import styles from './RuleBuilder.module.css';

export interface DraftRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface RuleBuilderProps {
  segmentName: string;
  segmentDescription: string;
  rules: DraftRule[];
  onAddRule: () => void;
  onRemoveRule: (id: string) => void;
  onRuleChange: (id: string, patch: Partial<DraftRule>) => void;
  onBack: () => void;
}

function getFieldLabel(field: string) {
  return ruleFieldOptions.find((option) => option.value === field)?.label ?? 'Rule';
}

function getOperatorLabel(field: string, operator: string) {
  return operatorOptionsByField[field]?.find((option) => option.value === operator)?.label ?? 'Select operator';
}

function getValueControl(
  rule: DraftRule,
  onRuleChange: (id: string, patch: Partial<DraftRule>) => void,
) {
  if (rule.field === 'tier') {
    return (
      <Select
        label="Value"
        value={rule.value}
        options={tierValueOptions}
        placeholder="Select tier"
        onChange={(event) => onRuleChange(rule.id, { value: event.target.value })}
      />
    );
  }

  return (
    <Input
      label="Value"
      type={getValueInputType(rule.field)}
      placeholder={rule.field === 'lastPurchaseDate' ? 'YYYY-MM-DD' : 'Enter value'}
      value={rule.value}
      onChange={(event) => onRuleChange(rule.id, { value: event.target.value })}
    />
  );
}

export function RuleBuilder({
  segmentName,
  segmentDescription,
  rules,
  onAddRule,
  onRemoveRule,
  onRuleChange,
  onBack,
}: RuleBuilderProps) {
  const hasCompleteRule = rules.some((rule) => rule.field && rule.operator && rule.value.trim());

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Rule builder</p>
        <h3 className={styles.title}>{segmentName}</h3>
        <p className={styles.description}>
          {segmentDescription || 'Define the audience logic by stacking rules with AND relationships.'}
        </p>
      </div>

      {!hasCompleteRule ? (
        <Alert variant="info" title="Add at least one rule">
          Pick a field, operator, and value before moving on to preview.
        </Alert>
      ) : null}

      <div className={styles.ruleList}>
        {rules.map((rule, index) => {
          const operatorOptions: SelectOption[] = operatorOptionsByField[rule.field] ?? [];

          return (
            <div key={rule.id} className={styles.ruleGroup}>
              {index > 0 ? <div className={styles.andLabel}>AND</div> : null}
              <div className={styles.ruleSummary}>
                <Chip label={`${getFieldLabel(rule.field)} · ${getOperatorLabel(rule.field, rule.operator)} · ${rule.value || 'No value yet'}`} />
              </div>
              <div className={styles.ruleGrid}>
                <Select
                  label="Field"
                  value={rule.field}
                  options={ruleFieldOptions}
                  placeholder="Select field"
                  onChange={(event) => {
                    const nextField = event.target.value;
                    onRuleChange(rule.id, {
                      field: nextField,
                      operator: getDefaultOperator(nextField),
                      value: '',
                    });
                  }}
                />

                <Select
                  label="Operator"
                  value={rule.operator}
                  options={operatorOptions}
                  placeholder="Select operator"
                  disabled={!rule.field}
                  onChange={(event) => onRuleChange(rule.id, { operator: event.target.value })}
                />

                {getValueControl(rule, onRuleChange)}
              </div>

              <div className={styles.ruleActions}>
                <Button variant="ghost" onClick={() => onRemoveRule(rule.id)}>
                  Remove rule
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <Button variant="neutral" onClick={onBack}>
          Back
        </Button>
        <Button variant="ghost" onClick={onAddRule}>
          Add rule
        </Button>
        <Button disabled={!hasCompleteRule}>
          Preview next
        </Button>
      </div>
    </Card>
  );
}
