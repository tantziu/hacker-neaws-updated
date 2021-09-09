import { Console } from 'console';
import React, {ReactNode, useState, useReducer} from 'react';
import './App.css';

const initialStories: Story[] = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  }, {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
  }, 
];

const getAsyncStories = () =>
    new Promise<PromiseData>((resolve, reject) =>
      setTimeout(
        () => resolve({data: {stories:initialStories}}),
        // reject,
        2000
      )
    )

// type Action = {type: 'SET_STORIES'}

const useSemiPersistentState = (key:string, initialState:string) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState)

    React.useEffect(() => {
      localStorage.setItem(key, value)
    }, [value, key])
  return [value, setValue] as const
}

const storiesReducer = (state:any, action:any) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoadding: true,
        isError: false
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      } 
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story:any) => action.payload.objectID !== story.objectID)
      }
    default:
      throw new Error()
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')

  // const [stories, setStories] = useState([] as Story[])
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    {data:[] as Story[], isLoading: false, isError: false}
  )

  // const [isLoading, setIsLoading] = useState(false)
  // const [isError, setIsError] = useState(false)

  React.useEffect(() => {
    // setIsLoading(true)
    dispatchStories({type: 'STORIES_FETCH_INIT'})

    getAsyncStories()
      .then((result) => {
        // setStories(result.data.stories)
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.stories
        })
        // setIsLoading(false)
      })
      .catch(() => 
        // setIsError(true)
        dispatchStories({type: 'STORIES_FETCH_FAILURE'})
      )
  }, [])

  const handleRemoveStory = (item:Story) => {
    // const newStories = stories.filter((story:any) => 
    //     item.objectID !== story.objectID
    // )
    // setStories(newStories)
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }

  // React.useEffect(() => {
  //   localStorage.setItem('search', searchTerm)
  // }, [searchTerm])

  const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.data.filter((story:any) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="App">
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search" type="text" value={searchTerm} isFocused onInputChange={handleSearch}>
        <strong>Search:</strong>
      </InputWithLabel>

      {stories.isError && <p>Something went wrong...</p>}

      {console.log("filteredStories", stories)}
      {stories.isLoading 
        ? (<p>Loading...</p>)
        : (<List list={searchedStories} onRemoveItem={handleRemoveStory} />)}
        {/* : (<p>lalala</p>)} */}
      <hr/>
      
    </div>
  );
}

type Story = {
  title: string
  url: string
  author: string
  num_comments: number
  points: number
  objectID: number
}


type PromiseData = {
  data:PromiseStories
}

type PromiseStories = {
  stories:Story[]
}

// -------------------------------------------------------------
type ListProps = {
  list: Story[]
  onRemoveItem:(item:Story) => void
}

const List = ({list, onRemoveItem}:ListProps) => 
  <div>
    {list.map(item => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
        )
      )}
  </div>

// ------------------------------------------------------------
type ItemProps = {
  item: Story
  onRemoveItem: (item:Story) => void
}

const Item = ({item, onRemoveItem}:ItemProps) => {
  // const handleRemoveItem = () => 
  //   onRemoveItem(item)

  return (
    <div>
      <span><a href={item.url}>{item.title}</a></span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button>
      </span>
    </div>
  )
}

// -------------------------------------------------------------
type InputWithLabelProps = {
  id: string
  value: string
  type: string
  isFocused: boolean
  onInputChange: (event:React.ChangeEvent<HTMLInputElement>) => void
  children:ReactNode
}

const InputWithLabel = ({id, type, value, isFocused, onInputChange, children}:InputWithLabelProps) => {
  // const inputRef = React.useRef()
  const inputRef = React.useRef<null | HTMLElement>(null)

  React.useEffect(() => {
    if (isFocused && inputRef.current) 
      inputRef.current.focus()
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input 
        ref={inputRef as any}
        id={id} 
        type={type} 
        value={value} /* autofocus={isFocused} */ 
        onChange={onInputChange}
      />
    </>
  )
}

export default App;
