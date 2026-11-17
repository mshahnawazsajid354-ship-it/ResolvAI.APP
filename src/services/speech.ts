/**
 * Browser-Supported Web Speech API Service
 * Bulletproof implementation for Chromium (Chrome, Edge), Safari, and Android browsers.
 * Handles microphone permissions, interim transcription streaming, and auto-recovery.
 */

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface SpeechTranscriptCallback {
  (interimText: string, finalText: string): void;
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscript: SpeechTranscriptCallback | null = null;
  private onError: ((msg: string) => void) | null = null;
  private onStatusChange: ((listening: boolean) => void) | null = null;
  private currentFinal: string = '';
  private autoRestart: boolean = false;

  getIsSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  async checkOrRequestMicPermission(): Promise<{ granted: boolean; error?: string }> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return { granted: true }; // Fall back to SpeechRecognition permission prompt
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the audio tracks immediately since we only needed the permission check
      stream.getTracks().forEach((track) => track.stop());
      return { granted: true };
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return {
          granted: false,
          error: 'Microphone permission was denied. Please click the lock or camera icon in your browser address bar and allow Microphone access.'
        };
      }
      return { granted: false, error: err.message || 'Microphone hardware was not detected.' };
    }
  }

  async startListening(
    onTranscript: SpeechTranscriptCallback,
    onError: (msg: string) => void,
    onStatusChange: (listening: boolean) => void
  ): Promise<boolean> {
    if (!this.getIsSupported()) {
      onError('Browser speech recognition is not supported in this environment. On Windows, you can click the response box and press Win + H for native system voice typing.');
      return false;
    }

    // Step 1: Explicitly check/request microphone permission first
    const perm = await this.checkOrRequestMicPermission();
    if (!perm.granted) {
      onError(perm.error || 'Microphone access is required.');
      return false;
    }

    // Stop existing instance if any
    this.stopListening();

    this.onTranscript = onTranscript;
    this.onError = onError;
    this.onStatusChange = onStatusChange;
    this.currentFinal = '';
    this.autoRestart = true;

    try {
      const win = window as unknown as IWindow;
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStatusChange) this.onStatusChange(true);
      };

      this.recognition.onresult = (event: any) => {
        let interimText = '';
        let newFinalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            newFinalText += item[0].transcript + ' ';
          } else {
            interimText += item[0].transcript;
          }
        }

        if (newFinalText) {
          this.currentFinal += newFinalText;
        }

        if (this.onTranscript) {
          this.onTranscript(interimText.trim(), this.currentFinal.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        const err = event.error;
        let userMessage = 'Microphone error occurred.';
        if (err === 'not-allowed') {
          userMessage = 'Microphone permission was blocked. Allow access in your browser address bar, or press Win + H on Windows for native voice typing.';
          this.autoRestart = false;
        } else if (err === 'no-speech') {
          // Normal when silent, don't alarm user
          return;
        } else if (err === 'network') {
          userMessage = 'Speech recognition requires internet connectivity. You can also press Win + H on Windows.';
        } else if (err === 'audio-capture') {
          userMessage = 'No microphone was detected. On Windows, you can press Win + H for native system voice typing.';
          this.autoRestart = false;
        }

        if (this.onError) this.onError(userMessage);
      };

      this.recognition.onend = () => {
        if (this.autoRestart && this.isListening) {
          try {
            this.recognition.start();
            return;
          } catch {
            // ignore
          }
        }
        this.isListening = false;
        if (this.onStatusChange) this.onStatusChange(false);
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      if (this.onStatusChange) this.onStatusChange(false);
      onError(`Failed to start microphone: ${err.message || 'Unknown error'}`);
      return false;
    }
  }

  stopListening(): void {
    this.autoRestart = false;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    if (this.onStatusChange) this.onStatusChange(false);
  }
}

export const speechService = new SpeechService();
