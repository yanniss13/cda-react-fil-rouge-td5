export default function SearchBar({ value, onChange }) {
  return (
    <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="recipe-search" className="sr-only">
        Rechercher une recette par nom
      </label>
      <input
        id="recipe-search"
        type="search"
        className="search__input"
        placeholder="Rechercher une recette (ex. : curry, pasta…)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
    </form>
  );
}
