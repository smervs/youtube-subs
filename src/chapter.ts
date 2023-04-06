
export interface Chapter {
  /**
   * The title of the chapter.
   */
  title: string;
  /**
   * The start time of the chapter in seconds.
   */
  start: number;
  /**
   * The end time of the chapter in seconds.
   */
  end: number | null;
}

type MultiMarkers = {
  multiMarkersPlayerBarRenderer: {
    visibleOnLoad: Object;
    markersMap: Array<{
      key: string;
      value: any;
    }>
  }
}

type ChapterContent = {
  chapterRenderer: {
    title: {
      simpleText: string;
    };
    timeRangeStartMillis: number;
  }
}

export class ChapterScraper {
  private readonly html: string;

  constructor(html: string) {
    this.html = html;
  }

  getChapters(): Chapter[] {
    const regex = /({"multiMarkersPlayerBarRenderer":{"visibleOnLoad":{(.*?)},"markersMap":\[{"key":(.*?),"value":{(.*?)}}(|,{"key":(.*?),"value":{.*?}})\]}}(}}]}})?)/;
    const matches = regex.exec(this.html);

    if (!matches?.length) return [];

    const { multiMarkersPlayerBarRenderer }: MultiMarkers = JSON.parse(`${matches[0]}`);
    const list: [] | null = multiMarkersPlayerBarRenderer?.markersMap[0]?.value?.chapters;

    if (!list) return [];

    let chapters: Chapter[] = [];
    for (let [index, entry] of list.entries()) {
      const content: ChapterContent = entry as ChapterContent;
      const chapter = content.chapterRenderer;

      if (!chapter) continue;

      const nextContent: ChapterContent = list[index + 1] as ChapterContent;
      const title = chapter.title.simpleText;
      const start = chapter.timeRangeStartMillis; // ms
      const end = (nextContent?.chapterRenderer?.timeRangeStartMillis - 1) || null; // ms

      chapters = [...chapters, {
        title,
        start: start / 1000, // s
        end: end ? end / 1000 : null // s
      }] as Chapter[];
    }

    return chapters;
  }
}