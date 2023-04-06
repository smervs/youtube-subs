import { YoutubeSubs } from "../src";

describe('Get All Captions', () => {

  test('should have a caption', async () => {
    const lines = await YoutubeSubs.getSubs('nogh434ykF0')
    expect(lines[0]).toEqual({
      start: 0,
      dur: 5.16,
      text: 'if I could change just one thing about',
    });
  });

  test('should not have a caption', async () => {
    await expect(YoutubeSubs.getSubs('AAjArZOoMRU')).rejects.toThrowError();
  });

});

describe('Get Captions By Time', () => {

  test('should have a correct caption with empty params', async () => {
    const lines = await YoutubeSubs.getSubsByTime('nogh434ykF0')
    expect(lines[0]).toEqual({
      start: 0,
      dur: 5.16,
      text: 'if I could change just one thing about'
    });
  });

  test('should have a correct caption with empty "to" params', async () => {
    const lines = await YoutubeSubs.getSubsByTime('nogh434ykF0', 10)
    expect(lines[0]).toEqual({
      start: 7.259,
      dur: 4.26,
      text: 'language I started off with it would a'
    });
  });

  test('should have a correct caption with empty "from" params', async () => {
    const lines = await YoutubeSubs.getSubsByTime('nogh434ykF0', null, 20)
    expect(lines[0]).toEqual({
      start: 0,
      dur: 5.16,
      text: 'if I could change just one thing about'
    });
  });

  test('should not have a caption', async () => {
    await expect(YoutubeSubs.getSubs('AAjArZOoMRU')).rejects.toThrowError();
  });

});