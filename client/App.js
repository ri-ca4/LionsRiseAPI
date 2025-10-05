import React, {useState} from 'react';
import {Text, View, TextInput, FlatList, Button, KeyboardAvoidingView} from 'react-native';
import { GlobalStyles } from './styles';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey there! Starting with the basics!', user: 'Gemini' },
    { id: '2', text: 'This is much faster than I expected!', user: 'You' },
  ]);

  const renderMessage = ({ item }) => (
    <View style={GlobalStyles.messageBubble}>
      <Text style={GlobalStyles.messageText}>{item.text}</Text>
      <Text style={GlobalStyles.userText}>— {item.user}</Text>
    </View>
  );

  const handleSend = () => {
    // 1. Basic validation: don't send empty messages
    if (inputText.trim() === '') {
      return; 
    };

    const userMessage= {
      id: Date.now().toString(),
      text: inputText,
      user: 'You',
    };

    setMessages(previousMessages => [userMessage, ...previousMessages]); 
    setInputText('');

    setTimeout(() => {
      const geminiResponse = {
        id: Date.now().toString() + 'g',
        text: `Got it! You sent: "${inputText}". I'm simulating a reply now!`,
        user: 'Gemini',
      };

      // We use the functional update form (previousMessages => ...) 
      // because state updates inside setTimeout can sometimes rely on old values
      setMessages(previousMessages => [geminiResponse, ...previousMessages]);
    }, 1000); // 1000 milliseconds = 1 second delay

  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={GlobalStyles.container}>
        <KeyboardAvoidingView 
          style={GlobalStyles.keyboardAvoiding} 
          behavior={'height'} // Simplified for Android
          // You can try removing this line if 'height' doesn't work perfectly:
          keyboardVerticalOffset={0} 
        >
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            inverted={true}
          />
          <View style={GlobalStyles.inputArea}>
            <TextInput
              style={GlobalStyles.input}
              placeholder='Start typing here...'
              value={inputText}
              onChangeText={setInputText}
            />
            <Button
              title="Send"
              onPress={handleSend}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}