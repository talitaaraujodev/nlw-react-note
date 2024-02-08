import { ChangeEvent, FormEvent, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface NewNoteCartProps {
  onNoteCreated: (content: string) => void;
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = new SpeechRecognitionAPI();

export function NewNoteCart({ onNoteCreated }: NewNoteCartProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [content, setContent] = useState('');

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if (event.target.value === '') {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    if (content === '') return;

    onNoteCreated(content);
    setContent('');
    setShouldShowOnboarding(true);
    toast.success('Nota criada com sucesso.');
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a api de gravação');
      return;
    }
    setIsRecording(true);
    setShouldShowOnboarding(false);

    speechRecognition.lang = 'pt-br';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '');
      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex flex-col gap-3 text-left rounded-md bg-slate-700 p-5 outline-none hover:ring-2 hover:ring-slate-600 hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Adicionar Nota</span>
        <p className="text-sm leading-6 text-slate-400">
          Comece gravando uma nota em áudio ou se preferir utilize apenas texto.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form action="POST" className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">Adicionar Nota</span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400 font-light">
                  Comece{' '}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartRecording}
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir {''}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto.
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  name="content"
                  id="content"
                  value={content}
                  onChange={(e) => handleContentChanged(e)}
                  cols={30}
                  rows={10}
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-slate-300 font-semibold py-4 text-center text-sm outline-none hover:text-slate-100 hover:cursor-pointer"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique para interroper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 text-lime-950 font-semibold py-4 text-center text-sm outline-none hover:bg-lime-500 hover:cursor-pointer"
              >
                Salvar Nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
