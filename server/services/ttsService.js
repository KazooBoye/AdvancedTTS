const { exec, spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ffmpeg = require('fluent-ffmpeg');
const engines = require('../config/engines');

class TTSService {
  constructor() {
    this.outputDir = path.join(__dirname, '../output');
    this.tempDir = path.join(__dirname, '../temp');
  }

  async checkEngineAvailability(engineName) {
    const engine = engines[engineName];
    if (!engine) return false;

    // Special handling for engines with custom paths
    let commandToCheck = engine.command;
    
    if (engineName === 'gtts') {
      // Check for gtts-cli in venv
      commandToCheck = '/Users/caoducanh/Desktop/Coding/AdvancedTTS/.venv/bin/gtts-cli';
    } else if (engineName === 'coqui') {
      // Check for tts in pyenv
      commandToCheck = '/Users/caoducanh/.pyenv/shims/tts';
    } else if (engineName === 'pyttsx3') {
      // Check for python3 for pyttsx3
      commandToCheck = '/Users/caoducanh/.pyenv/shims/python3';
    }

    return new Promise((resolve) => {
      exec(`test -f ${commandToCheck} && echo "exists" || which ${engine.command}`, (error, stdout) => {
        resolve(stdout.includes('exists') || (!error && stdout.trim().length > 0));
      });
    });
  }

  async getAllAvailableEngines() {
    const availableEngines = {};
    
    for (const [engineName, engineConfig] of Object.entries(engines)) {
      try {
        const isAvailable = await this.checkEngineAvailability(engineName);
        if (isAvailable) {
          availableEngines[engineName] = engineConfig;
        }
      } catch (error) {
        console.log(`Engine ${engineName} not available:`, error.message);
      }
    }
    
    return availableEngines;
  }

  async synthesizeSpeech(text, options = {}) {
    const {
      engine = 'espeak-ng',
      language = 'en',
      speed = 150,
      pitch = 50,
      volume = 100,
      format = 'mp3'
    } = options;

    // Validate engine
    const isAvailable = await this.checkEngineAvailability(engine);
    if (!isAvailable) {
      throw new Error(`TTS engine ${engine} is not available on this system`);
    }

    const engineConfig = engines[engine];
    const outputId = uuidv4();
    const outputFileName = `${outputId}.${format}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    const tempWavPath = path.join(this.tempDir, `${outputId}.wav`);

    try {
      // Generate speech based on engine
      await this.generateSpeechFile(engine, text, tempWavPath, {
        language,
        speed,
        pitch,
        volume
      });

      // Convert to requested format if not WAV
      if (format !== 'wav') {
        await this.convertAudioFormat(tempWavPath, outputPath, format);
        await fs.remove(tempWavPath); // Clean up temp file
      } else {
        await fs.move(tempWavPath, outputPath);
      }

      return {
        id: outputId,
        filename: outputFileName,
        path: outputPath,
        url: `/audio/${outputFileName}`,
        format: format,
        engine: engine,
        language: language,
        duration: await this.getAudioDuration(outputPath)
      };
    } catch (error) {
      // Clean up any temporary files
      await fs.remove(tempWavPath).catch(() => {});
      await fs.remove(outputPath).catch(() => {});
      throw error;
    }
  }

  async generateSpeechFile(engine, text, outputPath, options) {
    const { language, speed, pitch, volume } = options;

    switch (engine) {
      case 'espeak-ng':
        return this.generateEspeakNG(text, outputPath, { language, speed, pitch, volume });
      case 'espeak':
        return this.generateEspeak(text, outputPath, { language, speed, pitch, volume });
      case 'festival':
        return this.generateFestival(text, outputPath, { language, speed, volume });
      case 'pico':
        return this.generatePico(text, outputPath, { language, volume });
      case 'gtts':
        return this.generateGTTS(text, outputPath, { language, speed });
      case 'piper':
        return this.generatePiper(text, outputPath, { language, speed });
      case 'pyttsx3':
        return this.generatePyttsx3(text, outputPath, { language, speed, volume });
      case 'coqui':
        return this.generateCoqui(text, outputPath, { language, speed });
      default:
        throw new Error(`Unsupported engine: ${engine}`);
    }
  }

  generateEspeakNG(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language, speed, pitch, volume } = options;
      
      const args = [
        '-v', language,
        '-s', speed.toString(),
        '-p', pitch.toString(),
        '-a', Math.round(volume * 2).toString(), // eSpeak uses 0-200 scale
        '-w', outputPath,
        text
      ];

      const process = spawn('espeak-ng', args);
      
      let stderr = '';
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`eSpeak NG failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn eSpeak NG: ${error.message}`));
      });
    });
  }

  generateEspeak(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language, speed, pitch, volume } = options;
      
      const args = [
        '-v', language,
        '-s', speed.toString(),
        '-p', pitch.toString(),
        '-a', Math.round(volume * 2).toString(),
        '-w', outputPath,
        text
      ];

      const process = spawn('espeak', args);
      
      let stderr = '';
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`eSpeak failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn eSpeak: ${error.message}`));
      });
    });
  }

  generateFestival(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language, speed, volume } = options;
      
      // Create Festival script
      const script = `
        (voice_kal_diphone)
        (Parameter.set 'Duration_Stretch ${2 - (speed / 200)})
        (Parameter.set 'Audio_Method 'Audio_Command)
        (Parameter.set 'Audio_Required_Format 'wav)
        (Parameter.set 'Audio_Command "sox -t wav - -r 16000 -t wav '${outputPath}'")
        (SayText "${text.replace(/"/g, '\\"')}")
      `;

      const process = spawn('festival', ['--batch']);
      
      process.stdin.write(script);
      process.stdin.end();

      let stderr = '';
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Festival failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn Festival: ${error.message}`));
      });
    });
  }

  generatePico(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language } = options;
      
      const args = [
        '-l', language,
        '-w', outputPath,
        text
      ];

      const process = spawn('pico2wave', args);
      
      let stderr = '';
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Pico TTS failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn Pico TTS: ${error.message}`));
      });
    });
  }

  generateGTTS(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language, speed = 150 } = options;
      
      // Use the venv gtts-cli command with correct syntax
      const gttsCommand = '/Users/caoducanh/Desktop/Coding/AdvancedTTS/.venv/bin/gtts-cli';
      const args = [
        '--lang', language,
        '--output', outputPath
      ];

      // Add slow option if speed is low
      if (speed < 100) {
        args.push('--slow');
      }

      // Add the text as the last argument
      args.push(text);

      const process = spawn(gttsCommand, args);
      
      let stderr = '';
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Google TTS failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn Google TTS: ${error.message}`));
      });
    });
  }

  generatePiper(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language, speed = 1.0 } = options;
      
      // Piper TTS command
      const args = [
        '--model', `${language}`,
        '--output_file', outputPath
      ];

      if (speed !== 1.0) {
        args.push('--length_scale', (2.0 - speed).toString());
      }

      const process = spawn('piper', args);
      
      // Send text to stdin
      process.stdin.write(text);
      process.stdin.end();
      
      let stderr = '';
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Piper TTS failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn Piper TTS: ${error.message}`));
      });
    });
  }

  generatePyttsx3(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language, speed = 150, volume = 100 } = options;
      
      // Create a Python script for pyttsx3
      const pythonScript = `
import pyttsx3
import sys

try:
    engine = pyttsx3.init()
    engine.setProperty('rate', ${speed})
    engine.setProperty('volume', ${volume / 100})

    # Try to set voice based on language
    voices = engine.getProperty('voices')
    for voice in voices:
        if '${language}' in voice.id.lower() or '${language}' in voice.name.lower():
            engine.setProperty('voice', voice.id)
            break

    engine.save_to_file('${text.replace(/'/g, "\\'")}', '${outputPath}')
    engine.runAndWait()
    print("Success")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
`;

      const pythonCommand = '/Users/caoducanh/.pyenv/shims/python3';
      const process = spawn(pythonCommand, ['-c', pythonScript]);
      
      let stderr = '';
      let stdout = '';
      
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0 && stdout.includes('Success')) {
          resolve();
        } else {
          reject(new Error(`pyttsx3 failed: ${stderr || stdout || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn pyttsx3: ${error.message}`));
      });
    });
  }

  generateCoqui(text, outputPath, options) {
    return new Promise((resolve, reject) => {
      const { language, speed = 1.0 } = options;
      
      // Use pyenv tts command
      const ttsCommand = '/Users/caoducanh/.pyenv/shims/tts';
      const args = [
        '--text', text,
        '--model_name', `tts_models/en/ljspeech/vits`, // Default to English model
        '--out_path', outputPath
      ];

      const process = spawn(ttsCommand, args);
      
      let stderr = '';
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Coqui TTS failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn Coqui TTS: ${error.message}`));
      });
    });
  }

  convertAudioFormat(inputPath, outputPath, format) {
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      switch (format) {
        case 'mp3':
          command = command.audioCodec('libmp3lame').audioBitrate('192k');
          break;
        case 'ogg':
          command = command.audioCodec('libvorbis').audioBitrate('192k');
          break;
        case 'm4a':
          command = command.audioCodec('aac').audioBitrate('192k');
          break;
        default:
          return reject(new Error(`Unsupported format: ${format}`));
      }

      command
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (error) => reject(new Error(`Audio conversion failed: ${error.message}`)))
        .run();
    });
  }

  async getAudioDuration(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata.format.duration);
        }
      });
    });
  }

  async cleanupOldFiles(maxAge = 3600000) { // 1 hour default
    const now = Date.now();
    
    try {
      const files = await fs.readdir(this.outputDir);
      
      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.remove(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

module.exports = new TTSService();
