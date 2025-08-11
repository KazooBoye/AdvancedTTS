import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: "Advanced Text-to-Speech",
      subtitle: "Convert text to speech with multiple engines and languages",
      textInput: {
        label: "Enter your text here",
        placeholder: "Type or paste your text here...",
        characterCount: "{{count}} characters"
      },
      settings: {
        title: "Settings",
        engine: "TTS Engine",
        language: "Language",
        speed: "Speed",
        pitch: "Pitch",
        volume: "Volume",
        format: "Audio Format"
      },
      actions: {
        preview: "Preview",
        generate: "Generate Speech",
        download: "Download",
        clear: "Clear Text",
        stop: "Stop Audio"
      },
      status: {
        idle: "Ready to generate speech",
        processing: "Generating speech...",
        playing: "Playing audio",
        completed: "Speech generated successfully",
        error: "Error occurred"
      },
      errors: {
        textRequired: "Please enter some text",
        textTooLong: "Text is too long (maximum 50,000 characters)",
        networkError: "Network error occurred",
        serverError: "Server error occurred",
        audioError: "Audio playback error"
      },
      info: {
        previewNote: "Preview plays first 200 characters",
        unlimitedLength: "Unlimited text length supported",
        downloadReady: "Audio file ready for download",
        fallbackUsed: "Using {{actualEngine}} fallback due to {{reason}} with {{originalEngine}}"
      }
    }
  },
  vi: {
    translation: {
      title: "Chuyển Đổi Văn Bản Thành Giọng Nói",
      subtitle: "Chuyển đổi văn bản thành giọng nói với nhiều engine và ngôn ngữ",
      textInput: {
        label: "Nhập văn bản của bạn tại đây",
        placeholder: "Gõ hoặc dán văn bản của bạn vào đây...",
        characterCount: "{{count}} ký tự"
      },
      settings: {
        title: "Cài Đặt",
        engine: "Engine TTS",
        language: "Ngôn Ngữ",
        speed: "Tốc Độ",
        pitch: "Cao Độ",
        volume: "Âm Lượng",
        format: "Định Dạng Audio"
      },
      actions: {
        preview: "Xem Trước",
        generate: "Tạo Giọng Nói",
        download: "Tải Xuống",
        clear: "Xóa Văn Bản",
        stop: "Dừng Audio"
      },
      status: {
        idle: "Sẵn sàng tạo giọng nói",
        processing: "Đang tạo giọng nói...",
        playing: "Đang phát audio",
        completed: "Tạo giọng nói thành công",
        error: "Có lỗi xảy ra"
      },
      errors: {
        textRequired: "Vui lòng nhập văn bản",
        textTooLong: "Văn bản quá dài (tối đa 50,000 ký tự)",
        networkError: "Lỗi kết nối mạng",
        serverError: "Lỗi máy chủ",
        audioError: "Lỗi phát audio"
      },
      info: {
        previewNote: "Xem trước phát 200 ký tự đầu",
        unlimitedLength: "Hỗ trợ văn bản không giới hạn độ dài",
        downloadReady: "File audio sẵn sàng tải xuống",
        fallbackUsed: "Sử dụng {{actualEngine}} dự phòng do {{reason}} với {{originalEngine}}"
      }
    }
  },
  es: {
    translation: {
      title: "Texto a Voz Avanzado",
      subtitle: "Convierte texto a voz con múltiples motores e idiomas",
      textInput: {
        label: "Ingresa tu texto aquí",
        placeholder: "Escribe o pega tu texto aquí...",
        characterCount: "{{count}} caracteres"
      },
      settings: {
        title: "Configuración",
        engine: "Motor TTS",
        language: "Idioma",
        speed: "Velocidad",
        pitch: "Tono",
        volume: "Volumen",
        format: "Formato de Audio"
      },
      actions: {
        preview: "Vista Previa",
        generate: "Generar Voz",
        download: "Descargar",
        clear: "Limpiar Texto",
        stop: "Detener Audio"
      },
      status: {
        idle: "Listo para generar voz",
        processing: "Generando voz...",
        playing: "Reproduciendo audio",
        completed: "Voz generada exitosamente",
        error: "Ocurrió un error"
      },
      errors: {
        textRequired: "Por favor ingresa algún texto",
        textTooLong: "El texto es muy largo (máximo 50,000 caracteres)",
        networkError: "Error de red",
        serverError: "Error del servidor",
        audioError: "Error de reproducción de audio"
      },
      info: {
        previewNote: "La vista previa reproduce los primeros 200 caracteres",
        unlimitedLength: "Soporta texto de longitud ilimitada",
        downloadReady: "Archivo de audio listo para descargar"
      }
    }
  },
  fr: {
    translation: {
      title: "Synthèse Vocale Avancée",
      subtitle: "Convertir le texte en parole avec plusieurs moteurs et langues",
      textInput: {
        label: "Entrez votre texte ici",
        placeholder: "Tapez ou collez votre texte ici...",
        characterCount: "{{count}} caractères"
      },
      settings: {
        title: "Paramètres",
        engine: "Moteur TTS",
        language: "Langue",
        speed: "Vitesse",
        pitch: "Tonalité",
        volume: "Volume",
        format: "Format Audio"
      },
      actions: {
        preview: "Aperçu",
        generate: "Générer la Parole",
        download: "Télécharger",
        clear: "Effacer le Texte",
        stop: "Arrêter l'Audio"
      },
      status: {
        idle: "Prêt à générer la parole",
        processing: "Génération en cours...",
        playing: "Lecture audio",
        completed: "Parole générée avec succès",
        error: "Une erreur s'est produite"
      },
      errors: {
        textRequired: "Veuillez entrer du texte",
        textTooLong: "Le texte est trop long (maximum 50 000 caractères)",
        networkError: "Erreur réseau",
        serverError: "Erreur serveur",
        audioError: "Erreur de lecture audio"
      },
      info: {
        previewNote: "L'aperçu lit les 200 premiers caractères",
        unlimitedLength: "Supporte un texte de longueur illimitée",
        downloadReady: "Fichier audio prêt à télécharger",
        fallbackUsed: "Utilisation de {{actualEngine}} de repli en raison de {{reason}} avec {{originalEngine}}"
      }
    }
  },
  de: {
    translation: {
      title: "Erweiterte Text-zu-Sprache",
      subtitle: "Text in Sprache mit mehreren Engines und Sprachen konvertieren",
      textInput: {
        label: "Geben Sie Ihren Text hier ein",
        placeholder: "Tippen oder fügen Sie Ihren Text hier ein...",
        characterCount: "{{count}} Zeichen"
      },
      settings: {
        title: "Einstellungen",
        engine: "TTS-Engine",
        language: "Sprache",
        speed: "Geschwindigkeit",
        pitch: "Tonhöhe",
        volume: "Lautstärke",
        format: "Audio-Format"
      },
      actions: {
        preview: "Vorschau",
        generate: "Sprache Generieren",
        download: "Herunterladen",
        clear: "Text Löschen",
        stop: "Audio Stoppen"
      },
      status: {
        idle: "Bereit zur Sprachgenerierung",
        processing: "Sprache wird generiert...",
        playing: "Audio wird abgespielt",
        completed: "Sprache erfolgreich generiert",
        error: "Ein Fehler ist aufgetreten"
      },
      errors: {
        textRequired: "Bitte geben Sie Text ein",
        textTooLong: "Text ist zu lang (maximal 50.000 Zeichen)",
        networkError: "Netzwerkfehler",
        serverError: "Serverfehler",
        audioError: "Audio-Wiedergabefehler"
      },
      info: {
        previewNote: "Vorschau spielt die ersten 200 Zeichen ab",
        unlimitedLength: "Unterstützt unbegrenzte Textlänge",
        downloadReady: "Audio-Datei bereit zum Download"
      }
    }
  },
  zh: {
    translation: {
      title: "高级文本转语音",
      subtitle: "使用多种引擎和语言将文本转换为语音",
      textInput: {
        label: "在此输入您的文本",
        placeholder: "在此处输入或粘贴您的文本...",
        characterCount: "{{count}} 个字符"
      },
      settings: {
        title: "设置",
        engine: "TTS引擎",
        language: "语言",
        speed: "速度",
        pitch: "音调",
        volume: "音量",
        format: "音频格式"
      },
      actions: {
        preview: "预览",
        generate: "生成语音",
        download: "下载",
        clear: "清除文本",
        stop: "停止音频"
      },
      status: {
        idle: "准备生成语音",
        processing: "正在生成语音...",
        playing: "正在播放音频",
        completed: "语音生成成功",
        error: "发生错误"
      },
      errors: {
        textRequired: "请输入一些文本",
        textTooLong: "文本太长（最多50,000个字符）",
        networkError: "网络错误",
        serverError: "服务器错误",
        audioError: "音频播放错误"
      },
      info: {
        previewNote: "预览播放前200个字符",
        unlimitedLength: "支持无限长度文本",
        downloadReady: "音频文件准备下载"
      }
    }
  },
  ja: {
    translation: {
      title: "高度なテキスト読み上げ",
      subtitle: "複数のエンジンと言語でテキストを音声に変換",
      textInput: {
        label: "ここにテキストを入力してください",
        placeholder: "ここにテキストを入力または貼り付けてください...",
        characterCount: "{{count}} 文字"
      },
      settings: {
        title: "設定",
        engine: "TTSエンジン",
        language: "言語",
        speed: "速度",
        pitch: "ピッチ",
        volume: "音量",
        format: "音声形式"
      },
      actions: {
        preview: "プレビュー",
        generate: "音声生成",
        download: "ダウンロード",
        clear: "テキストクリア",
        stop: "音声停止"
      },
      status: {
        idle: "音声生成の準備完了",
        processing: "音声生成中...",
        playing: "音声再生中",
        completed: "音声生成成功",
        error: "エラーが発生しました"
      },
      errors: {
        textRequired: "テキストを入力してください",
        textTooLong: "テキストが長すぎます（最大50,000文字）",
        networkError: "ネットワークエラー",
        serverError: "サーバーエラー",
        audioError: "音声再生エラー"
      },
      info: {
        previewNote: "プレビューは最初の200文字を再生します",
        unlimitedLength: "無制限のテキスト長をサポート",
        downloadReady: "音声ファイルのダウンロード準備完了"
      }
    }
  },
  ko: {
    translation: {
      title: "고급 텍스트 음성 변환",
      subtitle: "여러 엔진과 언어로 텍스트를 음성으로 변환",
      textInput: {
        label: "여기에 텍스트를 입력하세요",
        placeholder: "여기에 텍스트를 입력하거나 붙여넣으세요...",
        characterCount: "{{count}} 글자"
      },
      settings: {
        title: "설정",
        engine: "TTS 엔진",
        language: "언어",
        speed: "속도",
        pitch: "음높이",
        volume: "볼륨",
        format: "오디오 형식"
      },
      actions: {
        preview: "미리보기",
        generate: "음성 생성",
        download: "다운로드",
        clear: "텍스트 지우기",
        stop: "오디오 중지"
      },
      status: {
        idle: "음성 생성 준비 완료",
        processing: "음성 생성 중...",
        playing: "오디오 재생 중",
        completed: "음성 생성 성공",
        error: "오류가 발생했습니다"
      },
      errors: {
        textRequired: "텍스트를 입력해주세요",
        textTooLong: "텍스트가 너무 깁니다 (최대 50,000자)",
        networkError: "네트워크 오류",
        serverError: "서버 오류",
        audioError: "오디오 재생 오류"
      },
      info: {
        previewNote: "미리보기는 처음 200자를 재생합니다",
        unlimitedLength: "무제한 텍스트 길이 지원",
        downloadReady: "오디오 파일 다운로드 준비 완료"
      }
    }
  },
  ru: {
    translation: {
      title: "Продвинутый Синтез Речи",
      subtitle: "Преобразование текста в речь с несколькими движками и языками",
      textInput: {
        label: "Введите ваш текст здесь",
        placeholder: "Введите или вставьте ваш текст здесь...",
        characterCount: "{{count}} символов"
      },
      settings: {
        title: "Настройки",
        engine: "TTS Движок",
        language: "Язык",
        speed: "Скорость",
        pitch: "Высота тона",
        volume: "Громкость",
        format: "Аудио Формат"
      },
      actions: {
        preview: "Предпросмотр",
        generate: "Сгенерировать Речь",
        download: "Скачать",
        clear: "Очистить Текст",
        stop: "Остановить Аудио"
      },
      status: {
        idle: "Готов к генерации речи",
        processing: "Генерация речи...",
        playing: "Воспроизведение аудио",
        completed: "Речь успешно сгенерирована",
        error: "Произошла ошибка"
      },
      errors: {
        textRequired: "Пожалуйста, введите текст",
        textTooLong: "Текст слишком длинный (максимум 50,000 символов)",
        networkError: "Ошибка сети",
        serverError: "Ошибка сервера",
        audioError: "Ошибка воспроизведения аудио"
      },
      info: {
        previewNote: "Предпросмотр воспроизводит первые 200 символов",
        unlimitedLength: "Поддерживает неограниченную длину текста",
        downloadReady: "Аудио файл готов к скачиванию"
      }
    }
  },
  pt: {
    translation: {
      title: "Texto para Fala Avançado",
      subtitle: "Converta texto em fala com múltiplos motores e idiomas",
      textInput: {
        label: "Digite seu texto aqui",
        placeholder: "Digite ou cole seu texto aqui...",
        characterCount: "{{count}} caracteres"
      },
      settings: {
        title: "Configurações",
        engine: "Motor TTS",
        language: "Idioma",
        speed: "Velocidade",
        pitch: "Tom",
        volume: "Volume",
        format: "Formato de Áudio"
      },
      actions: {
        preview: "Visualizar",
        generate: "Gerar Fala",
        download: "Baixar",
        clear: "Limpar Texto",
        stop: "Parar Áudio"
      },
      status: {
        idle: "Pronto para gerar fala",
        processing: "Gerando fala...",
        playing: "Reproduzindo áudio",
        completed: "Fala gerada com sucesso",
        error: "Ocorreu um erro"
      },
      errors: {
        textRequired: "Por favor, digite algum texto",
        textTooLong: "Texto muito longo (máximo 50.000 caracteres)",
        networkError: "Erro de rede",
        serverError: "Erro do servidor",
        audioError: "Erro de reprodução de áudio"
      },
      info: {
        previewNote: "Visualização reproduz os primeiros 200 caracteres",
        unlimitedLength: "Suporta texto de comprimento ilimitado",
        downloadReady: "Arquivo de áudio pronto para download"
      }
    }
  },
  it: {
    translation: {
      title: "Sintesi Vocale Avanzata",
      subtitle: "Converti testo in voce con più motori e lingue",
      textInput: {
        label: "Inserisci il tuo testo qui",
        placeholder: "Digita o incolla il tuo testo qui...",
        characterCount: "{{count}} caratteri"
      },
      settings: {
        title: "Impostazioni",
        engine: "Motore TTS",
        language: "Lingua",
        speed: "Velocità",
        pitch: "Tono",
        volume: "Volume",
        format: "Formato Audio"
      },
      actions: {
        preview: "Anteprima",
        generate: "Genera Voce",
        download: "Scarica",
        clear: "Cancella Testo",
        stop: "Ferma Audio"
      },
      status: {
        idle: "Pronto a generare voce",
        processing: "Generazione voce...",
        playing: "Riproduzione audio",
        completed: "Voce generata con successo",
        error: "Si è verificato un errore"
      },
      errors: {
        textRequired: "Per favore inserisci del testo",
        textTooLong: "Testo troppo lungo (massimo 50.000 caratteri)",
        networkError: "Errore di rete",
        serverError: "Errore del server",
        audioError: "Errore di riproduzione audio"
      },
      info: {
        previewNote: "L'anteprima riproduce i primi 200 caratteri",
        unlimitedLength: "Supporta testo di lunghezza illimitata",
        downloadReady: "File audio pronto per il download"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
