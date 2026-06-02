import { Input } from "../ui/Input";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar(_props: Props) {
  return (
    <Input
      type="search"
      placeholder="Search recipes by title or tag..."
      onChange={() => {
      }}
    />
  );
}
