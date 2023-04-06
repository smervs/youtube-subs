import { decode } from "html-entities";
import striptags from "striptags";

export interface Transcription {
  /**
   * The start time of the caption in seconds.
   */
  start: number;
  /**
   * The duration of the caption in seconds.
   */
  dur: number;
  /**
   * The text of the caption.
   */
  text: string;
}

export class Transcriber {
  private readonly transcript: string;
  private transcriptions: Array<Transcription> = [];

  constructor(transcript: string) {
    this.transcript = transcript;

    this.transcribe();
  }

  transcribe(): void {
    this.transcriptions = this.transcript
      .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', '')
      .replace('</transcript>', '')
      .split('</text>')
      .filter(line => line && line.trim())
      .map(line => {
        const startRegex = /start="([\d.]+)"/;
        const durRegex = /dur="([\d.]+)"/;

        const start = startRegex.exec(line);
        const dur = durRegex.exec(line);

        const htmlText = line
          .replace(/<text.+>/, '')
          .replace(/&amp;/gi, '&')
          .replace(/<\/?[^>]+(>|$)/g, '');

        const decodedText = decode(htmlText);
        const text = striptags(decodedText);

        return {
          start: Number(start?.[1]),
          dur: Number(dur?.[1]),
          text,
        };
      });
  }

  getTranscriptions(): Array<Transcription> {
    return this.transcriptions;
  }
}