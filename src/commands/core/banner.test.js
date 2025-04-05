import { describe, it, expect } from 'vitest';
import bannerCommand from './banner';
import { CATEGORIES } from '../index';

describe('Banner Command', () => {
  it('has the correct metadata', () => {
    expect(bannerCommand.metadata.name).toBe('banner');
    expect(bannerCommand.metadata.category).toBe(CATEGORIES.CORE);
    expect(bannerCommand.metadata.description).toBeDefined();
    expect(bannerCommand.metadata.usage).toBeDefined();
    expect(Array.isArray(bannerCommand.metadata.aliases)).toBe(true);
  });

  it('returns the welcome banner when executed', () => {
    const output = bannerCommand.execute();
    expect(output).toContain('nate.green');
    expect(output).toContain('interactive terminal');
    expect(output).toContain('Type \'help\'');
  });
});