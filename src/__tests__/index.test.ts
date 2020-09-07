import { PythagoreanCache } from '..';

describe('PythagoreanCache', () => {
  it('should throw an error if you do not specify a size or interval', (done) => {
    expect(() => new PythagoreanCache({})).toThrow(/You must specify either a size or interval \(or both\)/);
    done();
  });

  it('dump(): should emit items', (done) => {
    const cq = new PythagoreanCache<string>({ size: 10 });
    cq.push('foo');

    cq.once('dump', (items) => {
      expect(items).toEqual(['foo']);
      done();
    });

    cq.dump();
  });

  it('should emit items when size is reached', (done) => {
    const pushItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const cq = new PythagoreanCache<number>({ size: pushItems.length });

    cq.once('dump', (items) => {
      expect(items).toEqual(pushItems);
      done();
    });

    pushItems.forEach((item) => cq.push(item));
  });

  it('should emit items when interval is reached', (done) => {
    const pushItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const cq = new PythagoreanCache<number>({ interval: 10 });

    cq.once('dump', (items) => {
      cq.stopInterval();
      expect(items).toEqual(pushItems);
      done();
    });

    pushItems.forEach((item) => cq.push(item));
  });
});
