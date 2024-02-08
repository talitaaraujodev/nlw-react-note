import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCart } from './components/NewNoteCart';
import { NoteCart } from './components/NoteCart';
import { utils } from './utils';
import { Note } from './interfaces/Note';
import { InputSearch } from './components/InputSearch';

function App() {
  const [search, setSearch] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = utils.getNotes();

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };
    const notesSaved = [newNote, ...notes];
    setNotes(notesSaved);
    utils.setNotes(notesSaved);
  }
  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);

    utils.setNotes(notesArray);
    toast.success('Nota deletada com sucesso.');
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search !== '' ? notes.filter((note) => note.content.toLowerCase().includes(search.toLowerCase())) : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />
      <form action="" className="w-full">
        <InputSearch search={search} handleSearch={handleSearch} />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCart onNoteCreated={onNoteCreated} />
        {filteredNotes.map((item) => {
          return <NoteCart onNoteDeleted={onNoteDeleted} key={item.id} note={item} />;
        })}
      </div>
    </div>
  );
}

export default App;
