import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1, // Crucial: Makes the container take up the entire screen space
    backgroundColor: '#fff', // White background
    alignItems: 'center', // Centers children horizontally
    justifyContent: 'center', // Centers children vertically
  },
});