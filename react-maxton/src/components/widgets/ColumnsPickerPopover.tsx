import React, { useRef, useState, useEffect } from 'react';
import { Overlay, Popover, Form } from 'react-bootstrap';
import { loadPrefs, savePrefs, WidgetPrefs } from '../../utils/widgetPrefs';

export interface ColumnDef { id: string; label: string; }

export interface ColumnsPickerPopoverProps {
  widgetId: string;
  allColumns: ColumnDef[];
  defaults: WidgetPrefs;
  onChange: (prefs: WidgetPrefs) => void;
  trigger: React.ReactElement;
}

const ROWS_OPTIONS = [5, 10, 25, 50];

const ColumnsPickerPopover: React.FC<ColumnsPickerPopoverProps> = ({
  widgetId, allColumns, defaults, onChange, trigger,
}) => {
  const [show, setShow] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const [prefs, setPrefs] = useState<WidgetPrefs>(() => loadPrefs(widgetId, defaults));

  useEffect(() => { onChange(prefs); }, [prefs, onChange]);

  const toggleCol = (id: string) => {
    setPrefs(p => {
      const next = p.visibleColumns.includes(id)
        ? { ...p, visibleColumns: p.visibleColumns.filter(x => x !== id) }
        : { ...p, visibleColumns: [...p.visibleColumns, id] };
      savePrefs(widgetId, next);
      return next;
    });
  };

  const setRowsPerPage = (n: number) => {
    setPrefs(p => {
      const next = { ...p, rowsPerPage: n };
      savePrefs(widgetId, next);
      return next;
    });
  };

  // Clone trigger to attach onClick + ref.
  const triggerEl = React.cloneElement(trigger as any, {
    ref: (el: HTMLElement) => { targetRef.current = el; },
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShow(o => !o);
      const existing = (trigger.props as any).onClick;
      if (typeof existing === 'function') existing(e);
    },
  });

  return (
    <>
      {triggerEl}
      <Overlay target={targetRef.current} show={show} placement="bottom-end" rootClose onHide={() => setShow(false)}>
        <Popover id={`columns-picker-${widgetId}`} style={{ minWidth: 220 }}>
          <Popover.Header as="h6">Columns</Popover.Header>
          <Popover.Body>
            {allColumns.map(col => (
              <Form.Check
                key={col.id}
                type="checkbox"
                id={`col-${widgetId}-${col.id}`}
                label={col.label}
                checked={prefs.visibleColumns.includes(col.id)}
                onChange={() => toggleCol(col.id)}
              />
            ))}
            <hr />
            <Form.Group controlId={`rpp-${widgetId}`}>
              <Form.Label className="small mb-1">Rows per page</Form.Label>
              <Form.Select size="sm" value={prefs.rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}>
                {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </Form.Select>
            </Form.Group>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};

export default ColumnsPickerPopover;
