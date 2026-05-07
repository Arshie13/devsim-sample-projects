import { Input } from "../ui/Input";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

// L2-T2 BUG (intentional): the onChange handler does NOT call props.onChange.
// As a result, typing into the search bar does nothing — the parent feed never
// receives the new query. Students must:
//   (a) make this a controlled input (use props.value)
//   (b) propagate the change up via props.onChange(e.target.value)
//   (c) wire <SearchBar /> into <RecipeFeed /> so the feed can filter by query
export function SearchBar(_props: Props) {
  return (
    <Input
      type="search"
      placeholder="Search recipes by title or tag..."
      onChange={() => {
        /* no-op — fix in Level 2 task 2 */
      }}
    />
  );
}
