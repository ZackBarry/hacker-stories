import React from 'react';

type LastSearchProps = {
    url: {
        current: string,
        history: Array<string>,
    },
    onSearchSubmit: (term: string) => void,
}

const LastSearch = ({ url, onSearchSubmit }: LastSearchProps) => {
    return (
        <>
            {url.history.map(old_url => (
                <button
                    type='button'
                    onClick={() => onSearchSubmit(old_url)}
                >
                    {old_url} ONE TWO
                </button>
            ))};
        </>
    )
};

export default LastSearch;