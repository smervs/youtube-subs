import axios from "axios";
import { Transcriber, Transcription } from "./transcriber";
import { Track } from "./track";
import { ChapterScraper, Chapter } from "./chapter";

export interface YoutubeSubsOptions {
  /**
   * The language of the subtitles.
   * @default 'en'
   */
  lang: string;
}

type Options = Partial<YoutubeSubsOptions>;

export type ChapterTranscriptions = {
  title: string,
  from: number,
  to: number,
  captions: Transcription[]
};

const defaultOptions: YoutubeSubsOptions = {
  lang: 'en',
};

export class YoutubeSubs {
  private static options: Options = defaultOptions;

  /**
   * Get captions from a YouTube video.
   * @param videoId string
   * @param options Options
   * @returns Transcription[]
   */
  static async getSubs(videoId: string, options?: Options): Promise<Transcription[]> {
    this.options = { ...this.options, ...options };
    const { data } = await axios.get(`https://youtube.com/watch?v=${videoId}`);

    if (!data.includes('captionTracks'))
      throw new Error(`Could not find captions.`);

    const track = new Track(data);
    const captionTrack = track.getCaptionByLanguage(this.options.lang);

    if (!captionTrack || (captionTrack && !captionTrack.baseUrl))
      throw new Error(`Could not find ${this.options.lang} captions.`);

    const { data: transcript }: { data: string } = await axios.get(captionTrack.baseUrl);
    const transcriber = new Transcriber(transcript);
    return transcriber.getTranscriptions();
  }

  /**
   * Get all chapters and its captions from a YouTube video.
   * @param videoId string
   * @param options Options
   * @returns ChapterTranscriptions[]
   */
  static async getSubsByChapter(videoId: string, options?: Options): Promise<ChapterTranscriptions[]> {
    this.options = { ...this.options, ...options };
    const { data } = await axios.get(`https://youtube.com/watch?v=${videoId}`);

    if (!data.includes('captionTracks'))
      throw new Error(`Could not find captions.`);

    const track = new Track(data);
    const captionTrack = track.getCaptionByLanguage(this.options.lang);

    if (!captionTrack || (captionTrack && !captionTrack.baseUrl))
      throw new Error(`Could not find ${this.options.lang} captions.`);

    const { data: transcript }: { data: string } = await axios.get(captionTrack.baseUrl);
    const transcriber = new Transcriber(transcript);
    const transcriptions = transcriber.getTranscriptions();

    const chapterScraper = new ChapterScraper(data);
    const chapters: Chapter[] = chapterScraper.getChapters();

    const chapterTranscriptions: ChapterTranscriptions[] = chapters.map((chapter: Chapter) => {
      // filter transcriptions that are within the chapter
      const chapterTranscriptions = transcriptions.filter(transcription => {
        const captionEnd = transcription.start + transcription.dur;

        return (
          (Number(transcription.start) >= chapter.start || captionEnd >= chapter.start) &&
          (!chapter.end || transcription.start < chapter.end)
        );
      });

      return {
        title: chapter.title,
        from: chapter.start,
        to: chapter.end,
        captions: chapterTranscriptions
      } as ChapterTranscriptions;
    });

    return chapterTranscriptions;
  }

  /**
   * Get captions from a YouTube video by time.
   * @param videoId string
   * @param from number | null
   * @param to number | null
   * @param options Options
   * @returns
   */
  static async getSubsByTime(videoId: string, from?: number | null, to?: number | null, options?: Options): Promise<Transcription[]> {
    this.options = { ...this.options, ...options };
    const { data } = await axios.get(`https://youtube.com/watch?v=${videoId}`);

    if (!data.includes('captionTracks'))
      throw new Error(`Could not find captions.`);

    const track = new Track(data);
    const captionTrack = track.getCaptionByLanguage(this.options.lang);

    if (!captionTrack || (captionTrack && !captionTrack.baseUrl))
      throw new Error(`Could not find ${this.options.lang} captions.`);

    const { data: transcript }: { data: string } = await axios.get(captionTrack.baseUrl);
    const transcriber = new Transcriber(transcript);
    const transcriptions = transcriber.getTranscriptions();

    return transcriptions.filter(transcription => {
      const captionEnd = transcription.start + transcription.dur;

      return (
        (!from || (Number(transcription.start) >= from || captionEnd >= from)) &&
        (!to || transcription.start < to)
      );
    });

  }
}

export class YoutubeChapters {
  /**
   * Get all chapters and its captions from a YouTube video.
   * @param videoId string
   * @param options Options
   * @returns ChapterTranscriptions[]
   */
  static async getChapters(videoId: string): Promise<Chapter[]> {
    const { data } = await axios.get(`https://youtube.com/watch?v=${videoId}`);

    if (!data.includes('captionTracks'))
      throw new Error(`Could not find captions.`);

    const chapterScraper = new ChapterScraper(data);
    const chapters: Chapter[] = chapterScraper.getChapters();
    return chapters;
  }
}