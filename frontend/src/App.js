import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('vinallama/vinallama-7b');
  const messagesEndRef = useRef(null);

  // Danh sách model hỗ trợ tiếng Việt
  const availableModels = [
    { name: 'Vinallama 7B', value: 'vinallama/vinallama-7b' },
    { name: 'Gemma 2B', value: 'gemma:2b' },
    { name: 'Mistral 7B', value: 'mistral' },
    { name: 'OpenChat 3.5', value: 'openchat/openchat-3.5' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Thêm tin nhắn của người dùng vào lịch sử
    const userMessage = { text: message, isUser: true };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Gửi tin nhắn đến backend với system message hướng dẫn trả lời bằng tiếng Việt
      const response = await axios.post('http://localhost:8000/chat', {
        messages: [
          {
            role: "system",
            content: "Bạn là trợ lý AI nói tiếng Việt. Luôn trả lời bằng tiếng Việt với phong cách thân thiện, nhiệt tình."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: model,
        stream: false,
        options: {
          temperature: 0.7,
          num_ctx: 2048
        }
      });

      // Thêm phản hồi của bot vào lịch sử
      const botMessage = { 
        text: response.data.message.content, 
        isUser: false 
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      const errorMessage = { 
        text: 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn.', 
        isUser: false 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          ATech Chatbot
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Chọn Model</InputLabel>
          <Select
            value={model}
            label="Chọn Model"
            onChange={(e) => setModel(e.target.value)}
            disabled={isLoading}
          >
            {availableModels.map((model) => (
              <MenuItem key={model.value} value={model.value}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Paper elevation={3} sx={{ 
          height: '60vh', 
          mb: 2, 
          overflow: 'auto', 
          position: 'relative',
          backgroundColor: '#fafafa'
        }}>
          <List>
            {chatHistory.map((msg, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={msg.text}
                    sx={{
                      textAlign: msg.isUser ? 'right' : 'left',
                      backgroundColor: msg.isUser ? '#e3f2fd' : '#f0f4c3',
                      padding: 2,
                      borderRadius: 2,
                      maxWidth: '80%',
                      marginLeft: msg.isUser ? 'auto' : 0,
                      wordBreak: 'break-word'
                    }}
                  />
                </ListItem>
                {index < chatHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {isLoading && (
              <ListItem>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-start', 
                  width: '100%',
                  padding: 2
                }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Đang xử lý...
                  </Typography>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Paper>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập tin nhắn của bạn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            disabled={isLoading}
            multiline
            maxRows={4}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            sx={{ height: '56px' }}
          >
            Gửi
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
