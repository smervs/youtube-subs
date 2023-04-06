
export type CaptionTrack = {
  baseUrl: string;
  name: {
    simpleText: string;
  };
  vssId: string;
  languageCode: string;
  kind: string;
  isTranslatable: boolean;
}

export type CaptionTracks = Array<CaptionTrack>;

export class Track {
  private readonly data: string;

  constructor(data: string) {
    this.data = data;
  }

  getCaptions(): CaptionTracks {
    const regex = /({"captionTracks":.*isTranslatable":(true|false)}])/;
    const matches = regex.exec(this.data);

    if (!matches?.length) throw new Error(`Could not find captions.`);

    const { captionTracks }: { captionTracks: CaptionTracks } = JSON.parse(`${matches[0]}}`);
    return captionTracks;
  }

  getCaptionByLanguage(lang: string = 'en'): CaptionTrack | null {
    const captionTracks = this.getCaptions();

    const sub: CaptionTrack | undefined = captionTracks.find(
      (track) => track.languageCode === lang
    );

    return sub ? sub : null;
  }
}