import React from 'react';

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
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        story => action.payload.objectID !== story.objectID
      );
    default:
      throw new Error(`Action type not supported: ${action.type}`);
  }

};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const handleSearch = event => setSearchTerm(event.target.value);

  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const getAsyncStories = () =>
    new Promise(resolve => 
      setTimeout(
        () => resolve({ data: { stories: initialStories } }),
        2000
      )
    );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    []
  );

  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    getAsyncStories()
      .then(result => {
        dispatchStories({
            type: 'SET_STORIES',
            payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsError(true);
      });
  }, []);

  const handleRemoveStory = item => {
    dispatchStories({
        type: 'REMOVE_STORY',
        payload: item,
    });
  }

  const searchedStories = stories.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>"My Hacker Stories"</h1>

      <InputWithLabel 
        id="hacker-stories-main-search"
        value={searchTerm} 
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      { isError && <p>Error</p> }
      { isLoading ? (
        <p>Loading</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} /> 
      ) }
    </div>
  )
}

const InputWithLabel = ({ 
  id, 
  type = 'text',
  value, 
  onInputChange, 
  isFocused,
  children,
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