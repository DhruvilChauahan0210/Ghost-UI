import { describe, it, expect, beforeEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithGhost } from '@ghost-ui/testing/react';
import { useGhostPrivacy } from './context.js';
import { GhostPrivacyPanel } from './privacy-badge.js';

function PrivacyDisplay() {
  const { optOut, setOptOut, clearData } = useGhostPrivacy();
  return (
    <div>
      <span data-testid="opt-out-state">{String(optOut)}</span>
      <button type="button" onClick={() => setOptOut(true)}>Opt Out</button>
      <button type="button" onClick={() => setOptOut(false)}>Opt In</button>
      <button type="button" onClick={() => void clearData()}>Clear</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('useGhostPrivacy', () => {
  it('default optOut is false', () => {
    renderWithGhost(<PrivacyDisplay />);
    expect(screen.getByTestId('opt-out-state').textContent).toBe('false');
  });

  it('setOptOut(true) changes optOut to true', async () => {
    const user = userEvent.setup();
    renderWithGhost(<PrivacyDisplay />);

    await user.click(screen.getByRole('button', { name: 'Opt Out' }));

    expect(screen.getByTestId('opt-out-state').textContent).toBe('true');
  });

  it('when opted out, engine.record does not increase event count', async () => {
    const user = userEvent.setup();
    const { engine } = renderWithGhost(<PrivacyDisplay />);

    await user.click(screen.getByRole('button', { name: 'Opt Out' }));

    const countBefore = engine.events().length;
    engine.record('click', 'some-id', 'some-zone');
    expect(engine.events().length).toBe(countBefore);
  });

  it('clearData resets engine events to 0', async () => {
    const user = userEvent.setup();
    const { engine, settle } = renderWithGhost(<PrivacyDisplay />);

    engine._injectEvents([
      { id: 'x', zone: 'z', type: 'click', ts: Date.now() },
      { id: 'x', zone: 'z', type: 'click', ts: Date.now() },
    ]);
    await settle();
    expect(engine.events().length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    await act(async () => {});

    expect(engine.events().length).toBe(0);
  });
});

describe('GhostPrivacyPanel', () => {
  it('renders a toggle and a clear button', () => {
    renderWithGhost(<GhostPrivacyPanel />);
    expect(screen.getByRole('switch', { name: /disable ghost ui learning/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /clear ghost ui data/i })).toBeTruthy();
  });

  it('toggling the switch changes optOut state', async () => {
    const user = userEvent.setup();
    renderWithGhost(<GhostPrivacyPanel />);

    const toggle = screen.getByRole('switch', { name: /disable ghost ui learning/i });
    expect(toggle.getAttribute('aria-checked')).toBe('false');

    await user.click(toggle);

    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('clicking clear data triggers clearData', async () => {
    const user = userEvent.setup();
    const { engine, settle } = renderWithGhost(<GhostPrivacyPanel />);

    engine._injectEvents([
      { id: 'a', zone: 'z', type: 'click', ts: Date.now() },
    ]);
    await settle();
    expect(engine.events().length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /clear ghost ui data/i }));
    await act(async () => {});

    expect(engine.events().length).toBe(0);
  });
});
