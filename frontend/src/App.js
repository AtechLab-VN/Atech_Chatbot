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
  InputLabel,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('gemma:2b');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  const availableModels = [
    { name: 'Gemma 2B', value: 'gemma:2b' },
    // { name: 'VinaLlama 7B', value: 'vinallama/vinallama-7b' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, isUser: true };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Box
            component="img"
            src="/favicon.ico"
            alt="ATech Logo"
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 2,
              borderRadius: '50%'
            }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Box component="span" sx={{ color: 'black' }}>ATech</Box>
            <Box component="span" sx={{ color: 'red' }}> Chatbot</Box>
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={() => setShowSettings(!showSettings)}
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {showSettings && (
          <Paper elevation={3} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
            <FormControl fullWidth>
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
          </Paper>
        )}
        
        <Paper elevation={3} sx={{ 
          flex: 1,
          mb: 2, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: 2
        }}>
          <List sx={{ flex: 1, p: 1 }}>
            {chatHistory.length === 0 && (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary'
              }}>
                <Box
                  component="img"
                  src="/favicon.ico"
                  alt="ATech Logo"
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mb: 2,
                    opacity: 0.5,
                    borderRadius: '50%'
                  }}
                />
                <Typography variant="h6">Chào bạn! Tôi có thể giúp gì cho bạn?</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Hãy bắt đầu trò chuyện bằng cách nhập tin nhắn bên dưới</Typography>
              </Box>
            )}
            
            {chatHistory.map((msg, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ 
                  justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  py: 1.5
                }}>
                  {!msg.isUser && (
                    <Box
                      component="img"
                      src="/favicon.ico"
                      alt="ATech Bot"
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 2,
                        borderRadius: '50%'
                      }}
                    />
                  )}
                  <Box sx={{
                    maxWidth: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isUser ? 'flex-end' : 'flex-start'
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: 'text.secondary',
                      mb: 0.5 
                    }}>
                      {msg.isUser ? 'Bạn' : 'ATech Bot'}
                    </Typography>
                    <Paper elevation={0} sx={{
                      p: 2,
                      backgroundColor: msg.isUser ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: msg.isUser 
                        ? '18px 18px 4px 18px' 
                        : '18px 18px 18px 4px',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}>
                      <Typography variant="body1">{msg.text}</Typography>
                    </Paper>
                  </Box>
                  {msg.isUser && (
                    <Box
                      component="img"
                      src="/user.png"
                      alt="User"
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        ml: 2,
                        borderRadius: '50%'
                      }}
                    />
                  )}
                </ListItem>
              </React.Fragment>
            ))}
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <Box
                  component="img"
                  src="/favicon.ico"
                  alt="ATech Bot"
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 2,
                    borderRadius: '50%'
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '18px 18px 18px 4px',
                  px: 2,
                  py: 1.5
                }}>
                  <CircularProgress size={16} thickness={5} />
                  <Typography variant="body2" sx={{ ml: 1.5 }}>
                    Đang xử lý...
                  </Typography>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Paper>

        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 2,
          p: 1
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            disabled={isLoading}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff'
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            sx={{ 
              height: '56px',
              borderRadius: 2,
              minWidth: '100px'
            }}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default App;