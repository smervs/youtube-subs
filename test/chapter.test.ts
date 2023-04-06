import { YoutubeSubs } from "../src";
import { ChapterTranscriptions } from "../src/main";

describe('Get Captions by Chapters', () => {

  test('should not have chapters', async () => {
    const chapters = await YoutubeSubs.getSubsByChapter('mp21Py2m3Wo');
    expect(chapters.length).toEqual(0);
  });

  describe('should have a chapter and caption', () => {
    let chapters: ChapterTranscriptions[] = [];

    beforeAll(async () => {
      chapters = await YoutubeSubs.getSubsByChapter('kVGPZ4rFFBg')
    });

    test('should have a correct title', async () => {
      const first = chapters[0];
      expect(first.title).toEqual('Introduction');
    });

    test('should have a correct duration', async () => {
      const first = chapters[0];
      expect(first.from).toEqual(0);
      expect(first.to).toEqual(100.999);
    });

    test('should have a correct caption', async () => {
      const first = chapters[0];
      const captions = first.captions;
      expect(captions[0]).toEqual({
        start: 0.099,
        dur: 5.491,
        text: 'What if I told you that the cause of much\nof your suffering, confusion, anxiety, shame,',
      });
    });

  });

});