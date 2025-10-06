import React, {useState} from 'react';
import {Text, View, TextInput, FlatList, Button, KeyboardAvoidingView} from 'react-native';
import { GlobalStyles } from './styles';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
const chatModel = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });


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

  const handleSend = async () => {
    // 1. Basic validation: don't send empty messages
    if (inputText.trim() === '') {
      return; 
    };

    const userMessage= {
      id: Date.now().toString(),
      text: inputText,
      user: 'You',
    };

    const messageForApi = inputText;

    setMessages(previousMessages => [userMessage, ...previousMessages]); 
    setInputText(''); 
    
    const thinkingMessage = {
      id: Date.now().toString() + 'g',
      text: 'Gemini is thinking...',
      user: 'Gemini'
    }
    setMessages(previousMessages => [thinkingMessage, ...previousMessages]);


    try {
      const response = await chatModel.generateContent(messageForApi);
      console.log("FULL API RESPONSE:", response); 
      const geminiResponseText = response.response.text();

      setMessages(previousMessages => {
        const updatedMessages = previousMessages.filter(msg => msg.id !== thinkingMessage.id);

        const geminiMessage = {
          id: thinkingMessage.id,
          text: geminiResponseText,
          user: 'Gemini'
        };

        return [geminiMessage, ...updatedMessages];
      })

    } catch (error) {
      console.error('GeminiAPI Error:', error);
      const errorMessage = {
        id: Date.now().toString() + 'e',
        text: `Error: Could not connect to Gemini. Check your API key.`,
        user: 'System'
      }
      setMessages(previousMessages => [errorMessage, ...previousMessages]);
    }
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