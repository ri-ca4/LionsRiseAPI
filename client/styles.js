import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1, // Crucial: Makes the container take up the entire screen space
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: '80%', // Make it 80% of the screen width
    borderRadius: 6,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e6e6e6', // light gray
    marginVertical: 4,
    maxWidth: '80%', // keeps the bubble from taking up the whole row
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  inputArea: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
  },
  keyboardAvoiding: {
    flex: 1, // Crucial: Makes the entire chat area fill all available space
    width: '100%', // Ensures it takes up the full width
    alignItems: 'center', // This centers the message bubbles inside the chat area!
  },
});