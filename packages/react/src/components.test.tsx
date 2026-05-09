import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithGhost, buildEvents } from '@ghost-ui/testing/react';
import { Ghost } from './components.js';

describe('Ghost.Slot', () => {
  it('renders children', () => {
    renderWithGhost(
      <Ghost.Slot zone="test-slot">
        <Ghost.Item id="alpha" zone="test-slot">Alpha</Ghost.Item>
        <Ghost.Item id="beta" zone="test-slot">Beta</Ghost.Item>
      </Ghost.Slot>,
    );
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('reorders children after simulated clicks', async () => {
    const { engine, settle } = renderWithGhost(
      <Ghost.Slot zone="slot-order" staticLayout>
        <Ghost.Item id="first" zone="slot-order">First</Ghost.Item>
        <Ghost.Item id="second" zone="slot-order">Second</Ghost.Item>
        <Ghost.Item id="third" zone="slot-order">Third</Ghost.Item>
      </Ghost.Slot>,
    );

    const events = buildEvents([
      { id: 'third', zone: 'slot-order', count: 30 },
      { id: 'second', zone: 'slot-order', count: 15 },
      { id: 'first', zone: 'slot-order', count: 2 },
    ]);
    engine._injectEvents(events);
    await settle();

    const order = engine.getOrder('slot-order');
    expect(order[0]).toBe('third');
  });

  it('applies additional props (className)', () => {
    const { container } = renderWithGhost(
      <Ghost.Slot zone="test-props" className="my-slot" staticLayout>
        <Ghost.Item id="x" zone="test-props">X</Ghost.Item>
      </Ghost.Slot>,
    );
    expect(container.querySelector('.my-slot')).toBeTruthy();
  });
});

describe('Ghost.Button', () => {
  it('renders as a <button>', () => {
    renderWithGhost(
      <Ghost.Button id="btn1" zone="btn-zone">Click me</Ghost.Button>,
    );
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn.tagName.toLowerCase()).toBe('button');
  });

  it('records a click event on click', async () => {
    const user = userEvent.setup();
    const { engine, settle } = renderWithGhost(
      <Ghost.Button id="btn-click" zone="btn-zone">Save</Ghost.Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await settle();

    const clickEvents = engine.events().filter((e) => e.type === 'click' && e.id === 'btn-click');
    expect(clickEvents.length).toBeGreaterThan(0);
  });

  it('records a hover event on mouseenter', async () => {
    const user = userEvent.setup();
    const { engine, settle } = renderWithGhost(
      <Ghost.Button id="btn-hover" zone="btn-zone">Hover me</Ghost.Button>,
    );

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    await settle();

    const hoverEvents = engine.events().filter((e) => e.type === 'hover' && e.id === 'btn-hover');
    expect(hoverEvents.length).toBeGreaterThan(0);
  });
});

describe('Ghost.Item', () => {
  it('renders as a <div>', () => {
    const { container } = renderWithGhost(
      <Ghost.Item id="item1" zone="item-zone">Item One</Ghost.Item>,
    );
    const div = container.querySelector('[data-ghost-id="item1"]');
    expect(div).toBeTruthy();
    expect(div!.tagName.toLowerCase()).toBe('div');
  });

  it('records a click event on click', async () => {
    const user = userEvent.setup();
    const { engine, settle } = renderWithGhost(
      <Ghost.Item id="item-click" zone="item-zone">Clickable Item</Ghost.Item>,
    );

    await user.click(screen.getByText('Clickable Item'));
    await settle();

    const clickEvents = engine.events().filter((e) => e.type === 'click' && e.id === 'item-click');
    expect(clickEvents.length).toBeGreaterThan(0);
  });
});
