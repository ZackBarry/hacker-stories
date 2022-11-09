import React from 'react';

import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(
    () => localStorage.setItem(key, value),
    [value, key]
  );

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  console.log(state);

  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        data: [],
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false,
      };
    case 'REMOVE_STORY':
      let filtered = state.data.filter(
        story => action.payload.objectID !== story.objectID
      );
      return {
        ...state,
        data: filtered,
        isLoading: false,
        isError: false,
      };
    case 'STORIES_FETCH_FAILURE':
      console.log(action.payload);
      return {
        ...state,
        data: [],
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error(`Action type not supported: ${action.type}`);
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearch = event => {
    console.log(event);
    setSearchTerm(event.target.value);
  }

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { 'data': [], isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback(async () => {
    console.log(url);
    
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      let response = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: response.data.hits,
      });
    } catch (err) {
      dispatchStories({
        type: 'STORIES_FETCH_FAILURE',
        payload: err,
      });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories]);
  
  const handleRemoveStory = item => {
    dispatchStories({
        type: 'REMOVE_STORY',
        payload: item,
    });
  }

  const searchedStories = stories.data;

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  return (
    <div>
      <h1>"My Hacker Stories"</h1>

      <SearchForm
        handleSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
      />

      { stories.isError && <p>Error</p> }
      { stories.isLoading ? (
        <p>Loading</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} /> 
      ) }
    </div>
  )
}

const SearchForm = ({
  handleSearchSubmit,
  searchTerm,
  handleSearch,
}) => (
  <form onSubmit={handleSearchSubmit}>

    <InputWithLabel 
      id="hacker-stories-main-search"
      value={searchTerm} 
      isFocused
      onInputChange={handleSearch}
      searchTerm={searchTerm}
    >
      <strong>Search:</strong>
    </InputWithLabel>

  </form> 
)

const InputWithLabel = ({ 
  id, 
  type = 'text',
  value, 
  onInputChange, 
  isFocused,
  children,
  searchTerm,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        ref={inputRef}
        id={id} 
        type={type}
        value={value} 
        onChange={onInputChange}
      />
      <button type="submit" disabled={!searchTerm}>
        Submit
      </button>
      <hr/>
    </>
  )
}

const List = ( {list, onRemoveItem} ) => {
  return list.map(item => (
    <Item 
      key={item.objectID} 
      item={item} 
      onRemoveItem={onRemoveItem}
    />
  ));
}

const Item = ({ item, onRemoveItem }) => {
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button type='button' onClick={() => onRemoveItem(item)}>
        Click to delete
      </button>
    </div>
  )
}

export default App;