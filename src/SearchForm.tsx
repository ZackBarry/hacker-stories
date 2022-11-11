import React from 'react';

import InputWithLabel from './InputWithLabel';

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>, term: string) => void;
}
  
const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
}: SearchFormProps) => (
    <form 
        onSubmit={(e) => onSearchSubmit(e, searchTerm)} 
        className="search-form"
    >
  
        <InputWithLabel 
            id="hacker-stories-main-search"
            value={searchTerm} 
            isFocused
            onInputChange={onSearchInput}
            searchTerm={searchTerm}
        >
            <strong>Search:</strong>
        </InputWithLabel>
  
    </form> 
)

export default SearchForm;