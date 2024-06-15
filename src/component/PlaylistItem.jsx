import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

const PlaylistItem = ({ title, image, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.playlistItem}>
    <Image source={{ uri: image }} style={styles.playlistImage} />
    <View style={styles.playlistInfo}>
      <Text style={styles.playlistTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  playlistItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center'
  },
  playlistImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5 // Add rounded corners for better aesthetics
  },
  playlistInfo: {
    flex: 1
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default PlaylistItem
