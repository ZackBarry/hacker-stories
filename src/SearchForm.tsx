import React from 'react';

import InputWithLabel from './InputWithLabel';

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
  
const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
}: SearchFormProps) => (
    <form onSubmit={onSearchSubmit} className="search-form">
  
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