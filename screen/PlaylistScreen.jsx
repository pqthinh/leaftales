import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import { useNavigation } from '@react-navigation/native' // Assuming you're using React Navigation
import PlaylistItem from './PlaylistItem' // Import the PlaylistItem component

const PlaylistScreen = () => {
  const navigation = useNavigation()
  const [playlists, setPlaylists] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('https://your-api.com/playlists') // Replace with your API endpoint
        const data = await response.json()
        setPlaylists(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  const handlePlaylistPress = playlistId => {
    // Handle playlist selection (navigate to a playlist detail screen, play the playlist, etc.)
    navigation.navigate('PlaylistDetail', { playlistId }) // Assuming a PlaylistDetail screen exists
  }

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size='large' style={styles.loading} />}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {playlists.length > 0 ? (
        <FlatList
          data={playlists}
          renderItem={({ item }) => (
            <PlaylistItem
              key={item.id} // Use a unique identifier (replace with your actual ID property)
              title={item.title}
              image={item.imageUrl} // Assuming image URL property exists
              onPress={() => handlePlaylistPress(item.id)}
            />
          )}
          keyExtractor={item => item.id} // Use a unique identifier for key extraction
        />
      ) : (
        <Text>No playlists found.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  loading: {
    marginTop: 20
  },
  error: {
    color: 'red'
  }
})

export default PlaylistScreen
