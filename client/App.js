import React, {useState} from 'react';
import {TouchableOpacity, Text, View, TextInput, FlatList, Button, KeyboardAvoidingView} from 'react-native';
import { GlobalStyles } from './styles';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
//const chatModel = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });


export default function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const availableModels = [
    {name: "2.5 Flash", value: 'gemini-2.5-flash'},
    {name: "2.5 Pro", value: 'gemini-2.5-pro'},
  ];


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

    const currentModel = ai.getGenerativeModel({ model: selectedModel});

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
      const response = await currentModel.generateContent(messageForApi);
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
          behavior={'height'} 
          keyboardVerticalOffset={0} 
        >
          <View style={GlobalStyles.modelSelectionArea}>
            {availableModels.map((model) => (
              <TouchableOpacity
                key={model.value}
                onPress={()=> setSelectedModel(model.value)}
                style={[
                  GlobalStyles.modelButton,
                  selectedModel === model.value ? GlobalStyles.modelButtonSelected : GlobalStyles.modelButtonUnselected
                ]}
              >
                <Text style={GlobalStyles.modelButtonText}>
                  {model.name.split(' ')[1]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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