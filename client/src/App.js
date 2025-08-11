import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Tooltip,
  Chip,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';
import {
  VolumeUp,
  Download,
  Clear,
  Stop,
  PlayArrow,
  Settings,
  Language,
  RecordVoiceOver,
  Translate,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import { ttsAPI, enginesAPI, languagesAPI } from './services/api';

function App() {
  const { t, i18n } = useTranslation();
  
  // State management
  const [text, setText] = useState('');
  const [engines, setEngines] = useState({});
  const [availableModels, setAvailableModels] = useState([]);
  const [settings, setSettings] = useState({
    engine: 'espeak-ng',
    language: 'en',
    model: '', // Add model selection
    speaker: '', // Add speaker selection
    speed: 150,
    pitch: 50,
    volume: 100,
    format: 'mp3'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      await loadEngines();
      await loadLanguages();
    };
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update language when engine changes
  useEffect(() => {
    if (Object.keys(engines).length > 0) {
      const currentEngine = engines[settings.engine];
      if (currentEngine && currentEngine.languages && currentEngine.languages.length > 0) {
        // Check if current language is supported by the selected engine
        const supportedLanguages = currentEngine.languages.flatMap(lang => lang.variants);
        if (!supportedLanguages.includes(settings.language)) {
          // Set to first available language variant for this engine
          const firstLanguage = currentEngine.languages[0].variants[0];
          setSettings(prev => ({ ...prev, language: firstLanguage }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.engine, engines]);

  // Load models when engine or language changes
  useEffect(() => {
    if (settings.engine && settings.language) {
      loadModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.engine, settings.language]);

  const loadEngines = async () => {
    try {
      console.log('Loading engines...');
      const response = await enginesAPI.getAll();
      console.log('Engines response:', response);
      if (response.success) {
        setEngines(response.data);
        console.log('Engines loaded:', response.data);
        // Set default engine to first available
        const firstEngine = Object.keys(response.data)[0];
        console.log('First engine:', firstEngine);
        if (firstEngine && settings.engine !== firstEngine) {
          const firstLanguage = response.data[firstEngine].languages?.[0]?.variants?.[0] || 'en';
          console.log('Setting default language:', firstLanguage);
          setSettings(prev => ({ 
            ...prev, 
            engine: firstEngine,
            // Set first language variant for the default engine
            language: firstLanguage
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load engines:', error);
      setError(t('errors.serverError'));
    }
  };

  const loadLanguages = async () => {
    try {
      const response = await languagesAPI.getAll();
      if (response.success) {
        console.log('Languages loaded:', response.data);
      }
    } catch (error) {
      console.error('Failed to load languages:', error);
    }
  };

  const loadModels = async () => {
    try {
      console.log('Loading models for engine:', settings.engine, 'language:', settings.language);
      
      // Only load models for engines that support model selection (like Coqui TTS)
      const enginesWithModels = ['coqui'];
      if (!enginesWithModels.includes(settings.engine)) {
        setAvailableModels([]);
        setSettings(prev => ({ ...prev, model: '', speaker: '' }));
        return;
      }

      const response = await enginesAPI.getModels(settings.engine, settings.language);
      console.log('Models response:', response);
      
      if (response.success && response.data.models) {
        setAvailableModels(response.data.models);
        
        // Auto-select first model if none selected
        if (response.data.models.length > 0 && !settings.model) {
          const firstModel = response.data.models[0];
          setSettings(prev => ({ 
            ...prev, 
            model: firstModel.id,
            speaker: firstModel.speakers && firstModel.speakers.length > 0 ? firstModel.speakers[0] : ''
          }));
        }
      } else {
        setAvailableModels([]);
        setSettings(prev => ({ ...prev, model: '', speaker: '' }));
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      setAvailableModels([]);
      setSettings(prev => ({ ...prev, model: '', speaker: '' }));
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    setError(null);
  };

  const handleSettingChange = (setting, value) => {
    if (setting === 'engine') {
      // When engine changes, update language to first available for that engine
      const newEngine = engines[value];
      if (newEngine && newEngine.languages && newEngine.languages.length > 0) {
        const firstLanguage = newEngine.languages[0].variants[0];
        setSettings(prev => ({ 
          ...prev, 
          [setting]: value,
          language: firstLanguage,
          model: '', // Reset model when engine changes
          speaker: '' // Reset speaker when engine changes
        }));
      } else {
        setSettings(prev => ({ ...prev, [setting]: value, model: '', speaker: '' }));
      }
    } else if (setting === 'language') {
      // Reset model and speaker when language changes
      setSettings(prev => ({ ...prev, [setting]: value, model: '', speaker: '' }));
    } else if (setting === 'model') {
      // When model changes, update speaker to first available for that model
      const selectedModel = availableModels.find(model => model.id === value);
      const firstSpeaker = selectedModel?.speakers?.[0] || '';
      setSettings(prev => ({ ...prev, [setting]: value, speaker: firstSpeaker }));
    } else {
      setSettings(prev => ({ ...prev, [setting]: value }));
    }
  };

  const handlePreview = async () => {
    if (!text.trim()) {
      setError(t('errors.textRequired'));
      return;
    }

    setIsPreviewLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🎬 Starting preview with settings:', settings);
      const response = await ttsAPI.preview({
        text,
        ...settings
      });

      console.log('🎬 Preview response:', response);

      if (response.success) {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const audioUrl = `${baseUrl}${response.data.url}`;
        console.log('🎬 Constructed audio URL:', audioUrl);
        
        playAudio(audioUrl);
        setSuccess(t('info.previewNote'));
      } else {
        setError('Preview failed: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('🎬 Preview failed:', error);
      setError(error.response?.data?.message || error.message || t('errors.audioError'));
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError(t('errors.textRequired'));
      return;
    }

    if (text.length > 50000) {
      setError(t('errors.textTooLong'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await ttsAPI.synthesize({
        text,
        ...settings
      });

      if (response.success) {
        const fullAudioUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${response.data.url}`;
        setAudioUrl(fullAudioUrl);
        
        // Check if fallback was used and show notification
        if (response.data.fallback && response.data.fallback.used) {
          const fallbackMessage = `${t('status.completed')} - ${t('info.fallbackUsed', {
            originalEngine: response.data.fallback.originalEngine,
            actualEngine: response.data.fallback.actualEngine,
            reason: response.data.fallback.reason
          })}`;
          setSuccess(fallbackMessage);
        } else {
          setSuccess(t('status.completed'));
        }
        
        // Auto-play if it's a short text
        if (text.length < 500) {
          playAudio(fullAudioUrl);
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error.response?.data?.message || t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (url) => {
    console.log('🎵 playAudio called with URL:', url);
    
    if (!url) {
      console.error('❌ No URL provided to playAudio');
      return;
    }

    // Stop any currently playing audio
    if (audioRef) {
      console.log('🛑 Stopping current audio');
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsPlaying(false);
    }

    try {
      console.log('🔄 Creating new audio element for URL:', url);
      
      // Create audio element
      const audio = new Audio();
      
      // Set up event listeners with detailed logging
      audio.addEventListener('loadstart', () => {
        console.log('📡 Audio loadstart event fired');
      });
      
      audio.addEventListener('loadeddata', () => {
        console.log('📊 Audio loadeddata event - audio data loaded');
      });
      
      audio.addEventListener('canplay', () => {
        console.log('▶️ Audio canplay event - can start playing');
      });
      
      audio.addEventListener('canplaythrough', () => {
        console.log('� Audio canplaythrough event - can play through without interruption');
      });
      
      audio.addEventListener('play', () => {
        console.log('🎵 Audio play event fired');
        setIsPlaying(true);
      });
      
      audio.addEventListener('playing', () => {
        console.log('🎵 Audio is now playing');
        setIsPlaying(true);
      });
      
      audio.addEventListener('ended', () => {
        console.log('� Audio playback ended');
        setIsPlaying(false);
      });
      
      audio.addEventListener('pause', () => {
        console.log('⏸️ Audio paused');
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Audio error event:', e);
        console.error('Audio error details:', {
          error: audio.error,
          code: audio.error?.code,
          message: audio.error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src
        });
        
        let errorMessage = 'Audio playback failed';
        if (audio.error) {
          switch (audio.error.code) {
            case 1:
              errorMessage = 'Audio loading aborted';
              break;
            case 2:
              errorMessage = 'Network error loading audio';
              break;
            case 3:
              errorMessage = 'Audio decoding error';
              break;
            case 4:
              errorMessage = 'Audio format not supported';
              break;
            default:
              errorMessage = `Audio error (code: ${audio.error.code})`;
          }
        }
        
        setError(errorMessage);
        setIsPlaying(false);
      });

      // Set CORS to handle cross-origin requests
      audio.crossOrigin = 'anonymous';
      
      // Set the source and load
      console.log('🔗 Setting audio source and loading:', url);
      audio.src = url;
      audio.load();
      
      // Set as current audio reference
      setAudioRef(audio);
      
      // Try to play
      console.log('▶️ Attempting to play audio...');
      try {
        await audio.play();
        console.log('✅ Audio playback started successfully');
      } catch (playError) {
        console.error('❌ Play promise rejected:', playError);
        
        // Handle autoplay policy errors
        if (playError.name === 'NotAllowedError') {
          setError('Audio autoplay blocked by browser. Click the play button to start playback.');
        } else if (playError.name === 'NotSupportedError') {
          setError('Audio format not supported by this browser.');
        } else {
          setError(`Audio playback failed: ${playError.message || 'Unknown error'}`);
        }
        setIsPlaying(false);
      }
      
    } catch (error) {
      console.error('❌ Error in playAudio:', error);
      setError(`Audio playback failed: ${error.message || 'Unknown error'}`);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (audioUrl) {
      const filename = `tts-${Date.now()}.${settings.format}`;
      saveAs(audioUrl, filename);
    }
  };

  const clearText = () => {
    setText('');
    setError(null);
    setSuccess(null);
    setAudioUrl(null);
    stopAudio();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getAvailableLanguagesForEngine = () => {
    const currentEngine = engines[settings.engine];
    if (!currentEngine || !currentEngine.languages) {
      console.log('No engine or languages found for:', settings.engine);
      return [];
    }
    
    return currentEngine.languages;
  };

  const formatOptions = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'ogg', label: 'OGG' },
    { value: 'm4a', label: 'M4A' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <RecordVoiceOver sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('title')}
          </Typography>
          
          {/* Language Switcher */}
          <Box sx={{ ml: 2 }}>
            <FormControl variant="standard" sx={{ minWidth: 80 }}>
              <Select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                sx={{ 
                  color: 'inherit',
                  '&:before': { borderColor: 'rgba(255, 255, 255, 0.42)' },
                  '&:after': { borderColor: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' }
                }}
              >
                <MenuItem value="en">🇺🇸 EN</MenuItem>
                <MenuItem value="vi">🇻🇳 VI</MenuItem>
                <MenuItem value="es">🇪🇸 ES</MenuItem>
                <MenuItem value="fr">🇫🇷 FR</MenuItem>
                <MenuItem value="de">🇩🇪 DE</MenuItem>
                <MenuItem value="zh">🇨🇳 ZH</MenuItem>
                <MenuItem value="ja">🇯🇵 JA</MenuItem>
                <MenuItem value="ko">🇰🇷 KO</MenuItem>
                <MenuItem value="ru">🇷🇺 RU</MenuItem>
                <MenuItem value="pt">🇵🇹 PT</MenuItem>
                <MenuItem value="it">🇮🇹 IT</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Title and Description */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" component="h1" gutterBottom>
            {t('title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('subtitle')}
          </Typography>
          <Chip 
            icon={<Language />} 
            label={t('info.unlimitedLength')} 
            color="primary" 
            sx={{ mt: 1 }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Text Input Section */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Translate sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {t('textInput.label')}
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  variant="outlined"
                  placeholder={t('textInput.placeholder')}
                  value={text}
                  onChange={handleTextChange}
                  sx={{ mb: 2 }}
                />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    {t('textInput.characterCount', { count: text.length })}
                  </Typography>
                  
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={clearText}
                      startIcon={<Clear />}
                      sx={{ mr: 1 }}
                    >
                      {t('actions.clear')}
                    </Button>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    onClick={handlePreview}
                    disabled={!text.trim() || isPreviewLoading}
                    startIcon={isPreviewLoading ? <LinearProgress size={20} /> : <PlayArrow />}
                  >
                    {t('actions.preview')}
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={handleGenerate}
                    disabled={!text.trim() || isLoading}
                    startIcon={<VolumeUp />}
                    size="large"
                  >
                    {isLoading ? t('status.processing') : t('actions.generate')}
                  </Button>
                  
                  {isPlaying && (
                    <Button
                      variant="outlined"
                      onClick={stopAudio}
                      startIcon={<Stop />}
                      color="error"
                    >
                      {t('actions.stop')}
                    </Button>
                  )}
                  
                  {audioUrl && (
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      startIcon={<Download />}
                      color="success"
                    >
                      {t('actions.download')}
                    </Button>
                  )}
                </Box>

                {/* Progress Bar */}
                {(isLoading || isPreviewLoading) && (
                  <Box mt={2}>
                    <LinearProgress />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Settings Panel */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {t('settings.title')}
                </Typography>
                
                <Divider sx={{ mb: 2 }} />

                {/* Engine Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>{t('settings.engine')}</InputLabel>
                  <Select
                    value={settings.engine}
                    onChange={(e) => handleSettingChange('engine', e.target.value)}
                    label={t('settings.engine')}
                  >
                    {Object.entries(engines).map(([key, engine]) => (
                      <MenuItem key={key} value={key}>
                        {engine.name} - {engine.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Language Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>{t('settings.language')}</InputLabel>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    label={t('settings.language')}
                  >
                    {getAvailableLanguagesForEngine().map((lang) =>
                      lang.variants.map((variant) => (
                        <MenuItem key={variant} value={variant}>
                          {lang.name} ({variant.toUpperCase()})
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Model Selection (only for engines that support it) */}
                {availableModels.length > 0 && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Model</InputLabel>
                    <Select
                      value={settings.model}
                      onChange={(e) => handleSettingChange('model', e.target.value)}
                      label="Model"
                    >
                      {availableModels.map((model) => (
                        <MenuItem key={model.id} value={model.id}>
                          <Tooltip title={model.description || ''} placement="right">
                            <Box>
                              {model.name}
                              {model.quality && (
                                <Chip 
                                  label={model.quality} 
                                  size="small" 
                                  color={model.quality === 'high' ? 'success' : 'default'}
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          </Tooltip>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Speaker Selection (only for multi-speaker models) */}
                {settings.model && (() => {
                  const selectedModel = availableModels.find(model => model.id === settings.model);
                  return selectedModel?.speakers && selectedModel.speakers.length > 1;
                })() && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Speaker</InputLabel>
                    <Select
                      value={settings.speaker}
                      onChange={(e) => handleSettingChange('speaker', e.target.value)}
                      label="Speaker"
                    >
                      {(() => {
                        const selectedModel = availableModels.find(model => model.id === settings.model);
                        return selectedModel?.speakers?.map((speaker) => (
                          <MenuItem key={speaker} value={speaker}>
                            {speaker.charAt(0).toUpperCase() + speaker.slice(1)}
                          </MenuItem>
                        )) || [];
                      })()}
                    </Select>
                  </FormControl>
                )}

                {/* Audio Format */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>{t('settings.format')}</InputLabel>
                  <Select
                    value={settings.format}
                    onChange={(e) => handleSettingChange('format', e.target.value)}
                    label={t('settings.format')}
                  >
                    {formatOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Speed Control */}
                <Typography gutterBottom>{t('settings.speed')}: {settings.speed}</Typography>
                <Slider
                  value={settings.speed}
                  onChange={(e, value) => handleSettingChange('speed', value)}
                  min={50}
                  max={300}
                  step={10}
                  marks={[
                    { value: 50, label: '50' },
                    { value: 150, label: '150' },
                    { value: 300, label: '300' }
                  ]}
                  sx={{ mb: 3 }}
                />

                {/* Pitch Control */}
                <Typography gutterBottom>{t('settings.pitch')}: {settings.pitch}</Typography>
                <Slider
                  value={settings.pitch}
                  onChange={(e, value) => handleSettingChange('pitch', value)}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' }
                  ]}
                  sx={{ mb: 3 }}
                />

                {/* Volume Control */}
                <Typography gutterBottom>{t('settings.volume')}: {settings.volume}</Typography>
                <Slider
                  value={settings.volume}
                  onChange={(e, value) => handleSettingChange('volume', value)}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' }
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
      </Container>
    </Box>
  );
}

export default App;
