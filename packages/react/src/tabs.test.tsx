import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithGhost, buildEvents } from '@ghost-ui/testing/react';
import { Ghost } from './components.js';

function renderTabs(zone = 'tab-zone') {
  return renderWithGhost(
    <Ghost.Tab zone={zone} defaultTab="tab-a">
      <Ghost.Tab.List>
        <Ghost.Tab.Item id="tab-a">Tab A</Ghost.Tab.Item>
        <Ghost.Tab.Item id="tab-b">Tab B</Ghost.Tab.Item>
        <Ghost.Tab.Item id="tab-c">Tab C</Ghost.Tab.Item>
      </Ghost.Tab.List>
      <Ghost.Tab.Panel for="tab-a">Content A</Ghost.Tab.Panel>
      <Ghost.Tab.Panel for="tab-b">Content B</Ghost.Tab.Panel>
      <Ghost.Tab.Panel for="tab-c">Content C</Ghost.Tab.Panel>
    </Ghost.Tab>,
  );
}

describe('Ghost.Tab', () => {
  it('renders all tab items', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Tab A' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Tab B' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Tab C' })).toBeTruthy();
  });

  it('shows the default panel initially', () => {
    renderTabs();
    const panelA = document.getElementById('ghost-tabpanel-tab-a');
    const panelB = document.getElementById('ghost-tabpanel-tab-b');
    expect(panelA).toBeTruthy();
    expect(panelB).toBeTruthy();
    expect(panelA!.hasAttribute('hidden')).toBe(false);
    expect(panelB!.hasAttribute('hidden')).toBe(true);
  });

  it('clicking a tab item switches the visible panel', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Tab B' }));

    const panelA = document.getElementById('ghost-tabpanel-tab-a');
    const panelB = document.getElementById('ghost-tabpanel-tab-b');
    expect(panelA!.hasAttribute('hidden')).toBe(true);
    expect(panelB!.hasAttribute('hidden')).toBe(false);
  });

  it('renders panel content correctly', () => {
    renderTabs();
    expect(screen.getByText('Content A')).toBeTruthy();
    expect(screen.getByText('Content B')).toBeTruthy();
    expect(screen.getByText('Content C')).toBeTruthy();
  });

  it('reorders tabs after simulated clicks', async () => {
    const zone = 'tab-reorder';
    const { engine, settle } = renderWithGhost(
      <Ghost.Tab zone={zone} defaultTab="tab-a">
        <Ghost.Tab.List>
          <Ghost.Tab.Item id="tab-a">Tab A</Ghost.Tab.Item>
          <Ghost.Tab.Item id="tab-b">Tab B</Ghost.Tab.Item>
          <Ghost.Tab.Item id="tab-c">Tab C</Ghost.Tab.Item>
        </Ghost.Tab.List>
        <Ghost.Tab.Panel for="tab-a">Content A</Ghost.Tab.Panel>
        <Ghost.Tab.Panel for="tab-b">Content B</Ghost.Tab.Panel>
        <Ghost.Tab.Panel for="tab-c">Content C</Ghost.Tab.Panel>
      </Ghost.Tab>,
    );

    const events = buildEvents([
      { id: 'tab-c', zone, count: 40 },
      { id: 'tab-a', zone, count: 5 },
      { id: 'tab-b', zone, count: 2 },
    ]);
    engine._injectEvents(events);
    await settle();

    expect(engine).toHaveTopNode(zone, 'tab-c');
  });
});
