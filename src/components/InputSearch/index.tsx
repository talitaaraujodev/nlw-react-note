import { ChangeEvent } from 'react';

interface InputSearchProps {
  search: string;
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}
export function InputSearch({ search, handleSearch }: InputSearchProps) {
  return (
    <>
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Busque suas notas..."
        className="bg-transparent w-full text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
        value={search}
        onChange={handleSearch}
      />
    </>
  );
}
