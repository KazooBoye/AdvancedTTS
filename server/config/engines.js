const engines = {
  'espeak-ng': {
    name: 'eSpeak NG',
    description: 'Modern, lightweight TTS engine with excellent multi-language support',
    command: 'espeak-ng',
    supports: {
      ssml: true,
      speed: true,
      pitch: true,
      volume: true
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en-us', 'en-gb', 'en-au'] },
      { code: 'vi', name: 'Vietnamese', variants: ['vi'] },
      { code: 'es', name: 'Spanish', variants: ['es', 'es-mx'] },
      { code: 'fr', name: 'French', variants: ['fr', 'fr-ca'] },
      { code: 'de', name: 'German', variants: ['de'] },
      { code: 'it', name: 'Italian', variants: ['it'] },
      { code: 'pt', name: 'Portuguese', variants: ['pt', 'pt-br'] },
      { code: 'ru', name: 'Russian', variants: ['ru'] },
      { code: 'zh', name: 'Chinese', variants: ['zh', 'zh-yue'] },
      { code: 'ja', name: 'Japanese', variants: ['ja'] },
      { code: 'ko', name: 'Korean', variants: ['ko'] },
      { code: 'ar', name: 'Arabic', variants: ['ar'] },
      { code: 'hi', name: 'Hindi', variants: ['hi'] },
      { code: 'th', name: 'Thai', variants: ['th'] },
      { code: 'tr', name: 'Turkish', variants: ['tr'] },
      { code: 'pl', name: 'Polish', variants: ['pl'] },
      { code: 'nl', name: 'Dutch', variants: ['nl'] },
      { code: 'sv', name: 'Swedish', variants: ['sv'] },
      { code: 'da', name: 'Danish', variants: ['da'] },
      { code: 'no', name: 'Norwegian', variants: ['no'] }
    ]
  },
  'espeak': {
    name: 'eSpeak Classic',
    description: 'Classic, reliable TTS engine',
    command: 'espeak',
    supports: {
      ssml: false,
      speed: true,
      pitch: true,
      volume: true
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en', 'en-us', 'en-gb'] },
      { code: 'vi', name: 'Vietnamese', variants: ['vi'] },
      { code: 'es', name: 'Spanish', variants: ['es'] },
      { code: 'fr', name: 'French', variants: ['fr'] },
      { code: 'de', name: 'German', variants: ['de'] },
      { code: 'it', name: 'Italian', variants: ['it'] },
      { code: 'pt', name: 'Portuguese', variants: ['pt'] },
      { code: 'ru', name: 'Russian', variants: ['ru'] }
    ]
  },
  'festival': {
    name: 'Festival',
    description: 'High-quality speech synthesis system',
    command: 'festival',
    supports: {
      ssml: true,
      speed: true,
      pitch: false,
      volume: true
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en-us', 'en-gb'] }
    ]
  },
  'pico': {
    name: 'Pico TTS',
    description: 'Compact and efficient TTS engine',
    command: 'pico2wave',
    supports: {
      ssml: false,
      speed: false,
      pitch: false,
      volume: true
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en-us', 'en-gb'] },
      { code: 'es', name: 'Spanish', variants: ['es'] },
      { code: 'fr', name: 'French', variants: ['fr'] },
      { code: 'de', name: 'German', variants: ['de'] },
      { code: 'it', name: 'Italian', variants: ['it'] }
    ]
  },
  'gtts': {
    name: 'Google Text-to-Speech',
    description: 'High-quality neural voices from Google (requires internet)',
    command: 'gtts-cli',
    supports: {
      ssml: false,
      speed: true,
      pitch: false,
      volume: false
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en-us', 'en-gb', 'en-au', 'en-ca', 'en-in', 'en-ie', 'en-za'] },
      { code: 'vi', name: 'Vietnamese', variants: ['vi'] },
      { code: 'es', name: 'Spanish', variants: ['es', 'es-mx', 'es-ar', 'es-cl', 'es-co', 'es-pe', 'es-ve'] },
      { code: 'fr', name: 'French', variants: ['fr', 'fr-ca', 'fr-ch'] },
      { code: 'de', name: 'German', variants: ['de', 'de-at', 'de-ch'] },
      { code: 'it', name: 'Italian', variants: ['it'] },
      { code: 'pt', name: 'Portuguese', variants: ['pt', 'pt-br'] },
      { code: 'ru', name: 'Russian', variants: ['ru'] },
      { code: 'zh', name: 'Chinese', variants: ['zh', 'zh-tw'] },
      { code: 'ja', name: 'Japanese', variants: ['ja'] },
      { code: 'ko', name: 'Korean', variants: ['ko'] },
      { code: 'ar', name: 'Arabic', variants: ['ar'] },
      { code: 'hi', name: 'Hindi', variants: ['hi'] },
      { code: 'th', name: 'Thai', variants: ['th'] },
      { code: 'tr', name: 'Turkish', variants: ['tr'] },
      { code: 'pl', name: 'Polish', variants: ['pl'] },
      { code: 'nl', name: 'Dutch', variants: ['nl'] },
      { code: 'sv', name: 'Swedish', variants: ['sv'] },
      { code: 'da', name: 'Danish', variants: ['da'] },
      { code: 'no', name: 'Norwegian', variants: ['no'] },
      { code: 'fi', name: 'Finnish', variants: ['fi'] },
      { code: 'hu', name: 'Hungarian', variants: ['hu'] },
      { code: 'cs', name: 'Czech', variants: ['cs'] },
      { code: 'sk', name: 'Slovak', variants: ['sk'] },
      { code: 'uk', name: 'Ukrainian', variants: ['uk'] },
      { code: 'bg', name: 'Bulgarian', variants: ['bg'] },
      { code: 'hr', name: 'Croatian', variants: ['hr'] },
      { code: 'sr', name: 'Serbian', variants: ['sr'] },
      { code: 'sl', name: 'Slovenian', variants: ['sl'] },
      { code: 'et', name: 'Estonian', variants: ['et'] },
      { code: 'lv', name: 'Latvian', variants: ['lv'] },
      { code: 'lt', name: 'Lithuanian', variants: ['lt'] },
      { code: 'ro', name: 'Romanian', variants: ['ro'] },
      { code: 'mt', name: 'Maltese', variants: ['mt'] },
      { code: 'cy', name: 'Welsh', variants: ['cy'] },
      { code: 'is', name: 'Icelandic', variants: ['is'] }
    ]
  },
  'piper': {
    name: 'Piper TTS',
    description: 'Fast, local neural text-to-speech with high-quality voices',
    command: 'piper',
    supports: {
      ssml: false,
      speed: true,
      pitch: false,
      volume: false
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en-us', 'en-gb'] },
      { code: 'vi', name: 'Vietnamese', variants: ['vi'] },
      { code: 'es', name: 'Spanish', variants: ['es', 'es-mx'] },
      { code: 'fr', name: 'French', variants: ['fr'] },
      { code: 'de', name: 'German', variants: ['de'] },
      { code: 'it', name: 'Italian', variants: ['it'] },
      { code: 'pt', name: 'Portuguese', variants: ['pt', 'pt-br'] },
      { code: 'ru', name: 'Russian', variants: ['ru'] },
      { code: 'zh', name: 'Chinese', variants: ['zh'] },
      { code: 'ja', name: 'Japanese', variants: ['ja'] },
      { code: 'ko', name: 'Korean', variants: ['ko'] },
      { code: 'ar', name: 'Arabic', variants: ['ar'] },
      { code: 'hi', name: 'Hindi', variants: ['hi'] },
      { code: 'th', name: 'Thai', variants: ['th'] },
      { code: 'tr', name: 'Turkish', variants: ['tr'] },
      { code: 'pl', name: 'Polish', variants: ['pl'] },
      { code: 'nl', name: 'Dutch', variants: ['nl'] },
      { code: 'sv', name: 'Swedish', variants: ['sv'] },
      { code: 'da', name: 'Danish', variants: ['da'] },
      { code: 'no', name: 'Norwegian', variants: ['no'] },
      { code: 'fi', name: 'Finnish', variants: ['fi'] },
      { code: 'hu', name: 'Hungarian', variants: ['hu'] },
      { code: 'cs', name: 'Czech', variants: ['cs'] },
      { code: 'uk', name: 'Ukrainian', variants: ['uk'] }
    ]
  },
  'pyttsx3': {
    name: 'pyttsx3',
    description: 'Python text-to-speech with system voices (SAPI/NSSpeechSynthesizer)',
    command: 'python3',
    supports: {
      ssml: false,
      speed: true,
      pitch: false,
      volume: true
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en-us', 'en-gb', 'en-au'] },
      { code: 'vi', name: 'Vietnamese', variants: ['vi'] },
      { code: 'es', name: 'Spanish', variants: ['es'] },
      { code: 'fr', name: 'French', variants: ['fr'] },
      { code: 'de', name: 'German', variants: ['de'] },
      { code: 'it', name: 'Italian', variants: ['it'] },
      { code: 'pt', name: 'Portuguese', variants: ['pt'] },
      { code: 'ru', name: 'Russian', variants: ['ru'] },
      { code: 'zh', name: 'Chinese', variants: ['zh'] },
      { code: 'ja', name: 'Japanese', variants: ['ja'] },
      { code: 'ko', name: 'Korean', variants: ['ko'] }
    ]
  },
  'coqui': {
    name: 'Coqui TTS',
    description: 'Deep learning toolkit for text-to-speech with neural voices',
    command: 'tts',
    supports: {
      ssml: false,
      speed: true,
      pitch: false,
      volume: false
    },
    languages: [
      { code: 'en', name: 'English', variants: ['en-us', 'en-gb'] },
      { code: 'vi', name: 'Vietnamese', variants: ['vi'] },
      { code: 'es', name: 'Spanish', variants: ['es'] },
      { code: 'fr', name: 'French', variants: ['fr'] },
      { code: 'de', name: 'German', variants: ['de'] },
      { code: 'it', name: 'Italian', variants: ['it'] },
      { code: 'pt', name: 'Portuguese', variants: ['pt', 'pt-br'] },
      { code: 'ru', name: 'Russian', variants: ['ru'] },
      { code: 'zh', name: 'Chinese', variants: ['zh'] },
      { code: 'ja', name: 'Japanese', variants: ['ja'] },
      { code: 'ko', name: 'Korean', variants: ['ko'] },
      { code: 'ar', name: 'Arabic', variants: ['ar'] },
      { code: 'hi', name: 'Hindi', variants: ['hi'] },
      { code: 'th', name: 'Thai', variants: ['th'] },
      { code: 'tr', name: 'Turkish', variants: ['tr'] },
      { code: 'pl', name: 'Polish', variants: ['pl'] },
      { code: 'nl', name: 'Dutch', variants: ['nl'] },
      { code: 'fi', name: 'Finnish', variants: ['fi'] },
      { code: 'hu', name: 'Hungarian', variants: ['hu'] },
      { code: 'cs', name: 'Czech', variants: ['cs'] }
    ]
  }
};

module.exports = engines;
