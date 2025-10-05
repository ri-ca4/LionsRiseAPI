import React, {useState} from 'react';
import {Text, View, TextInput, FlatList, Button} from 'react-native';
import { GlobalStyles } from './styles';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={GlobalStyles.container}>
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
            onPress={()=> console.log('Send Pressed!')}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}