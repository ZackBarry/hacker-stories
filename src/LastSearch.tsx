import React from 'react';

type LastSearchProps = {
    url: {
        current: string,
        history: Array<string>,
    },
    onSearchButtonSubmit: (term: string) => void,
}

const LastSearch = ({ url, onSearchButtonSubmit }: LastSearchProps) => {
    return (
        <>
            {url.history.map(old_url => (
                <button
                    type='button'
                    onClick={() => onSearchButtonSubmit(old_url)}
                >
                    {old_url}
                </button>
            ))};
        </>
    )
};

export default LastSearch;