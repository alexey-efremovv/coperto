import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { STOP_REASONS, type MenuItem, type StopItemPayload } from '@/types/menu';
import { stopItemSchema } from '../model/stop-schema';
import { useChangeStatus } from '../model/use-change-status';
import { STOP_REASON_LABELS } from './labels';

const REASON_OPTIONS = STOP_REASONS.map((reason) => ({
  value: reason,
  label: STOP_REASON_LABELS[reason],
}));

interface StopReasonPanelProps {
  item: MenuItem | undefined;
  onClose: () => void;
}

export function StopReasonPanel({ item, onClose }: StopReasonPanelProps) {
  const isOpen = item !== undefined;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div key="stop-panel" className="fixed inset-0 z-40">
          <motion.div
            className="absolute inset-0 bg-ink/20"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="stop-panel-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-y-0 right-0 w-full max-w-md bg-white p-6 shadow-xl"
          >
            <StopReasonForm item={item} onDone={onClose} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function StopReasonForm({ item, onDone }: { item: MenuItem; onDone: () => void }) {
  const changeStatus = useChangeStatus();
  const { status } = item;
  const isEditing = status.kind === 'stopped';

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StopItemPayload>({
    resolver: zodResolver(stopItemSchema),
    mode: 'onTouched',
    defaultValues: isEditing ? { reason: status.reason, until: status.until } : { until: null },
  });

  const submit = handleSubmit((payload) => {
    changeStatus.mutate({ item, status: { kind: 'stopped', ...payload } }, { onSuccess: onDone });
  });

  const submitLabel = isEditing ? 'Сохранить' : 'Поставить в стоп';

  return (
    <form onSubmit={submit} noValidate className="flex h-full flex-col gap-6">
      <div>
        <h2 id="stop-panel-title" className="text-lg font-semibold">
          {isEditing ? 'Изменить стоп' : 'Поставить в стоп-лист'}
        </h2>
        <p className="mt-1 text-sm text-ink/60">{item.title}</p>
      </div>

      <Select
        label="Причина"
        placeholder="Выберите причину"
        options={REASON_OPTIONS}
        error={errors.reason?.message}
        autoFocus
        {...register('reason')}
      />

      <Controller
        control={control}
        name="until"
        render={({ field, fieldState }) => (
          <UntilField
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <div className="mt-auto flex gap-3">
        <Button type="submit" variant="primary" isLoading={changeStatus.isPending}>
          {changeStatus.isPending ? 'Сохраняем…' : submitLabel}
        </Button>
        <Button onClick={onDone}>Отмена</Button>
      </div>
    </form>
  );
}

interface UntilFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onBlur: () => void;
  error?: string;
}

function UntilField({ value, onChange, onBlur, error }: UntilFieldProps) {
  const errorId = useId();
  const isExactTime = value !== null;

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-medium">Срок</legend>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="radio"
          name="until-mode"
          checked={!isExactTime}
          onChange={() => onChange(null)}
        />
        До конца смены
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="radio" name="until-mode" checked={isExactTime} onChange={() => onChange('')} />
        До конкретного времени
      </label>
      {isExactTime && (
        <input
          type="datetime-local"
          step={15 * 60}
          aria-label="Время окончания стопа"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={value ? toDateTimeLocal(value) : ''}
          onChange={(event) => onChange(fromDateTimeLocal(event.target.value))}
          onBlur={onBlur}
          className={`h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-ink/15 ${error ? 'border-red-600' : 'border-ink/20'}`}
        />
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function toDateTimeLocal(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : '';
}
