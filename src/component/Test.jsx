// components/BookComponent.js
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addBook,
  setReadingSpeed,
  setVolume,
  setPitch,
  setAction,
  addBookmark,
  addNote,
  addToPlaylist,
  searchBooks
} from '../store/bookReducer'
import { View, Text, TextInput, Button, FlatList } from 'react-native'

const BookComponent = () => {
  const dispatch = useDispatch()
  const books = useSelector(state => state.books.books)
  const [newBook, setNewBook] = useState({
    id: Date.now().toString(),
    title: '',
    author: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [speechSettings, setSpeechSettings] = useState({
    speed: 1,
    volume: 1,
    pitch: 1
  })
  const [recognizedText, setRecognizedText] = useState('')
  const [action, setActionState] = useState({})

  const handleAddBook = () => {
    dispatch(addBook(newBook))
    setNewBook({ id: Date.now().toString(), title: '', author: '' })
  }

  const handleSearch = () => {
    dispatch(searchBooks(searchQuery))
  }

  const handleAdjustSpeechSettings = () => {
    dispatch(setReadingSpeed(speechSettings.speed))
    dispatch(setVolume(speechSettings.volume))
    dispatch(setPitch(speechSettings.pitch))
  }

  const handleAddBookmark = (bookId, page) => {
    dispatch(addBookmark({ bookId, page }))
  }

  const handleAddNote = (bookId, word, definition) => {
    dispatch(addNote({ bookId, word, definition }))
  }

  const handleAddToPlaylist = bookId => {
    dispatch(addToPlaylist(bookId))
  }

  const handleSetRecognizedText = text => {
    dispatch(setRecognizedText(text))
    // Here you can parse the text and set the action accordingly
    // For example, parse the text to determine the action:
    const parsedAction = {} // Parse text and determine action
    dispatch(setAction(parsedAction))
  }

  return (
    <View>
      <TextInput
        placeholder='Title'
        value={newBook.title}
        onChangeText={text => setNewBook({ ...newBook, title: text })}
      />
      <TextInput
        placeholder='Author'
        value={newBook.author}
        onChangeText={text => setNewBook({ ...newBook, author: text })}
      />
      <Button title='Add Book' onPress={handleAddBook} />

      <TextInput
        placeholder='Search'
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <Button title='Search' onPress={handleSearch} />

      <Text>Speech Settings</Text>
      <TextInput
        placeholder='Speed'
        value={speechSettings.speed.toString()}
        onChangeText={text =>
          setSpeechSettings({ ...speechSettings, speed: parseFloat(text) })
        }
      />
      <TextInput
        placeholder='Volume'
        value={speechSettings.volume.toString()}
        onChangeText={text =>
          setSpeechSettings({ ...speechSettings, volume: parseFloat(text) })
        }
      />
      <TextInput
        placeholder='Pitch'
        value={speechSettings.pitch.toString()}
        onChangeText={text =>
          setSpeechSettings({ ...speechSettings, pitch: parseFloat(text) })
        }
      />
      <Button
        title='Adjust Speech Settings'
        onPress={handleAdjustSpeechSettings}
      />

      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.title} by {item.author}
            </Text>
            <Button
              title='Bookmark Page 10'
              onPress={() => handleAddBookmark(item.id, 10)}
            />
            <Button
              title='Add Note'
              onPress={() => handleAddNote(item.id, 'example', 'definition')}
            />
            <Button
              title='Add to Playlist'
              onPress={() => handleAddToPlaylist(item.id)}
            />
          </View>
        )}
      />

      <TextInput
        placeholder='Recognized Text'
        value={recognizedText}
        onChangeText={text => setRecognizedText(text)}
      />
      <Button
        title='Set Recognized Text'
        onPress={() => handleSetRecognizedText(recognizedText)}
      />
    </View>
  )
}

export default BookComponent
