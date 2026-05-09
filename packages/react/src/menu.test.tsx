import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithGhost, buildEvents } from '@ghost-ui/testing/react';
import { Ghost } from './components.js';

function renderMenu(zone = 'menu-zone') {
  return renderWithGhost(
    <Ghost.Menu zone={zone}>
      <Ghost.Menu.Trigger>
        <button type="button">Open Menu</button>
      </Ghost.Menu.Trigger>
      <Ghost.Menu.Content>
        <Ghost.Menu.Item id="copy">Copy</Ghost.Menu.Item>
        <Ghost.Menu.Item id="paste">Paste</Ghost.Menu.Item>
        <Ghost.Menu.Item id="delete">Delete</Ghost.Menu.Item>
      </Ghost.Menu.Content>
    </Ghost.Menu>,
  );
}

describe('Ghost.Menu', () => {
  it('menu content not visible initially', () => {
    renderMenu();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('clicking trigger opens menu', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));

    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('clicking menu item closes menu', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    expect(screen.getByRole('menu')).toBeTruthy();

    await user.click(screen.getByText('Copy'));

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('clicking menu item records a click event on engine', async () => {
    const user = userEvent.setup();
    const { engine, settle } = renderMenu();

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    await user.click(screen.getByText('Paste'));
    await settle();

    const clickEvents = engine.events().filter((e) => e.type === 'click' && e.id === 'paste');
    expect(clickEvents.length).toBeGreaterThan(0);
  });

  it('most-clicked item ranks first after repeated use', async () => {
    const zone = 'menu-rank';
    const user = userEvent.setup();
    const { engine, settle } = renderWithGhost(
      <Ghost.Menu zone={zone}>
        <Ghost.Menu.Trigger>
          <button type="button">Open</button>
        </Ghost.Menu.Trigger>
        <Ghost.Menu.Content>
          <Ghost.Menu.Item id="copy">Copy</Ghost.Menu.Item>
          <Ghost.Menu.Item id="paste">Paste</Ghost.Menu.Item>
          <Ghost.Menu.Item id="delete">Delete</Ghost.Menu.Item>
        </Ghost.Menu.Content>
      </Ghost.Menu>,
    );

    // Open the menu so menu item nodes get registered with the engine
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());

    // Inject events while the menu is open so nodes are still registered
    const events = buildEvents([
      { id: 'paste', zone, count: 50 },
      { id: 'copy', zone, count: 5 },
      { id: 'delete', zone, count: 2 },
    ]);
    engine._injectEvents(events);
    await settle();

    expect(engine).toHaveTopNode(zone, 'paste');
  });

  it('Escape key closes menu', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    expect(screen.getByRole('menu')).toBeTruthy();

    // Fire Escape directly on the menu content element which handles the keydown
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });
});
