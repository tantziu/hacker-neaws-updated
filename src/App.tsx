import React, {useState} from 'react';
import './App.css';

type Story = {
  title: string
  url: string
  author: string
  num_comments: number
  points: number
  objectID: number
}

const useSemiPersistentState = (key:string, initialState:string) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState)

    React.useEffect(() => {
      localStorage.setItem(key, value)
    }, [value, key])
  return [value, setValue] as const
}

const App = () => {
  const stories: Story[] = [
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')

  // React.useEffect(() => {
  //   localStorage.setItem('search', searchTerm)
  // }, [searchTerm])

  const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="App">
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch}/>
      <hr/>
      <List list={searchedStories}/>
    </div>
  );
}

// -------------------------------------------------------------
type ListProps = {
  list: Story[] 
}

const List = ({list}:ListProps) => 
  <div>
    {list.map(item => (
        <Item key={item.objectID} item={item}/>
        )
      )}
  </div>

// ------------------------------------------------------------
type ItemProps = {
  item: Story
}

const Item = ({item}:ItemProps) => (
  <div>
    <span><a href={item.url}>{item.title}</a></span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </div>
)

// -------------------------------------------------------------
type SearchProps = {
  search: string
  onSearch: (event:React.ChangeEvent<HTMLInputElement>) => void
}

const Search = ({search, onSearch}:SearchProps) => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value)
    onSearch(event)
  }

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" value={search} onChange={handleChange}/>
      <p>Searching for <strong>{searchTerm}</strong>.</p>
    </div>
    
  )
}

export default App;
