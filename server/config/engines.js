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
      volume: false,
      models: true  // New feature: supports model selection
    },
    languages: [
      { 
        code: 'en', 
        name: 'English', 
        variants: ['en-us', 'en-gb'],
        models: [
          {
            id: 'ljspeech-vits',
            name: 'LJSpeech VITS',
            description: 'High-quality female voice trained on LJSpeech dataset',
            model_name: 'tts_models/en/ljspeech/vits',
            language: 'en-us',
            speaker: 'female',
            quality: 'high'
          },
          {
            id: 'ljspeech-tacotron2',
            name: 'LJSpeech Tacotron2',
            description: 'Neural voice using Tacotron2 architecture',
            model_name: 'tts_models/en/ljspeech/tacotron2-DDC',
            language: 'en-us',
            speaker: 'female',
            quality: 'medium'
          },
          {
            id: 'vctk-vits',
            name: 'VCTK Multi-Speaker',
            description: 'Multi-speaker English model with voice selection',
            model_name: 'tts_models/en/vctk/vits',
            language: 'en-gb',
            speaker: 'multi',
            quality: 'high',
            speakers: ['p225', 'p226', 'p227', 'p228', 'p229', 'p230', 'p231', 'p232', 'p233', 'p234']
          }
        ]
      },
      { 
        code: 'es', 
        name: 'Spanish', 
        variants: ['es'],
        models: [
          {
            id: 'mai-vits',
            name: 'MAI Spanish',
            description: 'High-quality Spanish voice',
            model_name: 'tts_models/es/mai/tacotron2-DDC',
            language: 'es',
            speaker: 'female',
            quality: 'high'
          }
        ]
      },
      { 
        code: 'fr', 
        name: 'French', 
        variants: ['fr'],
        models: [
          {
            id: 'mai-fr-vits',
            name: 'MAI French',
            description: 'High-quality French voice',
            model_name: 'tts_models/fr/mai/tacotron2-DDC',
            language: 'fr',
            speaker: 'female',
            quality: 'high'
          }
        ]
      },
      { 
        code: 'de', 
        name: 'German', 
        variants: ['de'],
        models: [
          {
            id: 'thorsten-vits',
            name: 'Thorsten German',
            description: 'High-quality German male voice',
            model_name: 'tts_models/de/thorsten/vits',
            language: 'de',
            speaker: 'male',
            quality: 'high'
          }
        ]
      },
      { 
        code: 'it', 
        name: 'Italian', 
        variants: ['it'],
        models: [
          {
            id: 'mai-it-vits',
            name: 'MAI Italian',
            description: 'High-quality Italian voice',
            model_name: 'tts_models/it/mai_female/vits',
            language: 'it',
            speaker: 'female',
            quality: 'high'
          }
        ]
      },
      { 
        code: 'pt', 
        name: 'Portuguese', 
        variants: ['pt', 'pt-br'],
        models: [
          {
            id: 'cv-vits',
            name: 'Portuguese Common Voice',
            description: 'Portuguese voice trained on Common Voice dataset',
            model_name: 'tts_models/pt/cv/vits',
            language: 'pt',
            speaker: 'mixed',
            quality: 'medium'
          }
        ]
      },
      { 
        code: 'zh', 
        name: 'Chinese', 
        variants: ['zh'],
        models: [
          {
            id: 'baker-vits',
            name: 'Chinese Baker',
            description: 'High-quality Chinese voice',
            model_name: 'tts_models/zh-CN/baker/tacotron2-DDC-GST',
            language: 'zh',
            speaker: 'female',
            quality: 'high'
          }
        ]
      },
      { 
        code: 'ja', 
        name: 'Japanese', 
        variants: ['ja'],
        models: [
          {
            id: 'kokoro-vits',
            name: 'Japanese Kokoro',
            description: 'High-quality Japanese voice',
            model_name: 'tts_models/ja/kokoro/tacotron2-DDC',
            language: 'ja',
            speaker: 'female',
            quality: 'high'
          }
        ]
      }
    ]
  }
};

module.exports = engines;
