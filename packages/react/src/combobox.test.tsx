import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithGhost, buildEvents } from '@ghost-ui/testing/react';
import { Ghost } from './components.js';

function renderCombobox(zone = 'combo-zone', onSelect?: (id: string, value: string) => void) {
  return renderWithGhost(
    <Ghost.Combobox zone={zone} onSelect={onSelect}>
      <Ghost.Combobox.Input placeholder="Search..." />
      <Ghost.Combobox.List>
        <Ghost.Combobox.Option id="apple" value="Apple">Apple</Ghost.Combobox.Option>
        <Ghost.Combobox.Option id="banana" value="Banana">Banana</Ghost.Combobox.Option>
        <Ghost.Combobox.Option id="cherry" value="Cherry">Cherry</Ghost.Combobox.Option>
      </Ghost.Combobox.List>
    </Ghost.Combobox>,
  );
}

describe('Ghost.Combobox', () => {
  it('typing in input opens the list', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    await user.type(input, 'a');

    await waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('true'));
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('options render in the list', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.type(screen.getByRole('combobox'), 'a');

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeTruthy();
      expect(screen.getByText('Banana')).toBeTruthy();
      expect(screen.getByText('Cherry')).toBeTruthy();
    });
  });

  it('clicking an option calls onSelect with (id, value)', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderCombobox('combo-select', onSelect);

    await user.type(screen.getByRole('combobox'), 'a');
    await waitFor(() => expect(screen.getByText('Banana')).toBeTruthy());
    await user.click(screen.getByText('Banana'));

    expect(onSelect).toHaveBeenCalledWith('banana', 'Banana');
  });

  it('clicking an option records a click event on engine', async () => {
    const user = userEvent.setup();
    const { engine, settle } = renderCombobox();

    await user.type(screen.getByRole('combobox'), 'a');
    await waitFor(() => expect(screen.getByText('Apple')).toBeTruthy());
    await user.click(screen.getByText('Apple'));
    await settle();

    const clickEvents = engine.events().filter((e) => e.type === 'click' && e.id === 'apple');
    expect(clickEvents.length).toBeGreaterThan(0);
  });

  it('clicking an option selects it and updates the input value', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    await user.type(input, 'a');
    await waitFor(() => expect(screen.getByText('Cherry')).toBeTruthy());

    await user.click(screen.getByText('Cherry'));

    // The input value is updated to the selected option's display value
    await waitFor(() => expect((input as HTMLInputElement).value).toBe('Cherry'));
  });

  it('after repeated selection the chosen option ranks first', async () => {
    const zone = 'combo-rank';
    const user = userEvent.setup();
    const { engine, settle } = renderWithGhost(
      <Ghost.Combobox zone={zone}>
        <Ghost.Combobox.Input placeholder="Search..." />
        <Ghost.Combobox.List>
          <Ghost.Combobox.Option id="apple" value="Apple">Apple</Ghost.Combobox.Option>
          <Ghost.Combobox.Option id="banana" value="Banana">Banana</Ghost.Combobox.Option>
          <Ghost.Combobox.Option id="cherry" value="Cherry">Cherry</Ghost.Combobox.Option>
        </Ghost.Combobox.List>
      </Ghost.Combobox>,
    );

    const input = screen.getByRole('combobox');

    // Open list so options register their nodes with the engine
    await user.type(input, 'a');
    await waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('true'));
    await waitFor(() => expect(screen.getByText('Cherry')).toBeTruthy());

    // Inject events while list is open (nodes are registered)
    const events = buildEvents([
      { id: 'cherry', zone, count: 40 },
      { id: 'apple', zone, count: 8 },
      { id: 'banana', zone, count: 3 },
    ]);
    engine._injectEvents(events);
    await settle();

    expect(engine).toHaveTopNode(zone, 'cherry');
  });

  it('Escape closes list', async () => {
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox');
    await user.type(input, 'a');
    await waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('true'));

    await user.keyboard('{Escape}');

    // The input's aria-expanded reflects the closed state
    await waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('false'));
  });
});
