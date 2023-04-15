# Youtube Subs [![npm version](https://badge.fury.io/js/youtube-subs.svg)](https://badge.fury.io/js/youtube-subs)

This package will fetch youtube captions and chapters.

**NOTE**: This is a rebuild of [Algolia's YouTube scraper](https://github.com/algolia/youtube-captions-scraper) that includes additional functionalities for my own use case.

## Installation

```sh
$ npm install --save youtube-subs
```

## Usage

```javascript
import { YoutubeSubs, YoutubeChapters } from 'youtube-subs';

// Fetch all captions
const captions = await YoutubeSubs.getSubs(videoId, options);

// Fetch all chapters and its captions
const chapters = await YoutubeSubs.getSubsByChapter(videoId, options);

// Fetch captions by time in seconds
const captions = await YoutubeSubs.getSubsByTime(videoId, from, to, options);

// Fetch all chapters without captions
const chapters = await YoutubeChapters.getChapters(videoId);
```

## Types

### Options

Key | Description | Default
--- | --- | ---
`lang` | Field name specified in the form | `en`


## License

[MIT](LICENSE)