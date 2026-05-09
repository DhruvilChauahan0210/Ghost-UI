import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { ghostMatchers } from '@ghost-ui/testing';
expect.extend(ghostMatchers);
afterEach(() => cleanup());
