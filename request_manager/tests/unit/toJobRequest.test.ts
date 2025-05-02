import { toJobRequest } from '../../src/types/jobRequest';

describe('toJobRequest', () => {
  it('accepts valid input', () => {
    const input = { job: 'clean', time: 1000 };
    expect(toJobRequest(input)).toEqual(input);
  });

  it('rejects missing job', () => {
    const input = { time: 1000 };
    expect(toJobRequest(input)).toBeNull();
  });

  it('rejects missing time', () => {
    const input = { job: 'clean' };
    expect(toJobRequest(input)).toBeNull();
  });

  it('rejects non-numeric time', () => {
    const input = { job: 'clean', time: 'abc' };
    expect(toJobRequest(input)).toBeNull();
  });
});
