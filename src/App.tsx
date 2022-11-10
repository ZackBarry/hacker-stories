import React from 'react';
import axios from 'axios';

import { Story, Stories } from './types';
import List from './List';
import SearchForm from './SearchForm';

import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (
  key: string, 
  initialState: string,
): [string, (newValue: string) => void] => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(
    () => localStorage.setItem(key, value),
    [value, key]
  );

  return [value, setValue];
};

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
}

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
}
interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
  payload: any;
}
interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction

const storiesReducer = (
  state: StoriesState, 
  action: StoriesAction,
) => {
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
  }
};

function useSearchBar() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const onSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const onSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  return { searchTerm, url, onSearchInput, onSearchSubmit }
};

const App = () => {
  const { searchTerm, url, onSearchInput, onSearchSubmit } = useSearchBar();

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { 'data': [], isLoading: false, isError: false }
  );

  const searchedStories = stories.data;

  const handleFetchStories = React.useCallback(async () => {
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
  
  const handleRemoveStory = (item: Story) => {
    dispatchStories({
        type: 'REMOVE_STORY',
        payload: item,
    });
  }

  return (
    <div className="container">
      <h1 className="headline-primary">"My Hacker Stories"</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={onSearchInput}
        onSearchSubmit={onSearchSubmit}
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

export default App;