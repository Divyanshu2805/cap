import React, { useContext, useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../assets/assets';
import { Context } from '../../../context/context';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const [isListening, setIsListening] = useState(false);
    const [welcomeText, setWelcomeText] = useState('');
    const welcomeMessage = "How can I assist you today?";

    useEffect(() => {
        let index = -1;
        setWelcomeText(''); // Reset welcome text on re-mount
        const interval = setInterval(() => {
            setWelcomeText((prev) => prev + welcomeMessage[index]);
            index++;
            if (index === welcomeMessage.length-1) {
                clearInterval(interval);
            }
        }, 100); // Typing speed in milliseconds

        return () => clearInterval(interval); // Clean up interval on unmount
    }, [welcomeMessage]);

    const handleVoiceInput = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => setInput(event.results[0][0].transcript);

        recognition.start();
    };

    const handleSend = () => {
        if (input) {
            onSent();
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <header className="chat-header">
                <div className="chat-brand">
                    <img src={assets.logo} alt="ThaparGenie Logo" />
                </div>
                <img className="university-logo" src={assets.tiet} alt="University" />
            </header>

            {/* Main Section */}
            <main className="chat-main">
                {!showResult ? (
                    <div className="chat-welcome">
                        <h1>Welcome!</h1>
                        <p className="typing-effect">{welcomeText}</p>
                    </div>
                ) : (
                    <div className="chat-response">
                        <div className="user-query">
                            <img src={assets.user_icon} alt="User" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="ai-response">
                            <img src={assets.gemini_icon} alt="AI" />
                            {loading ? (
                                <div className="loading-spinner">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                        <div className="response-actions">
                            <button onClick={handleSend} className="action-btn">
                                <img src={assets.regenerate} alt="Regenerate" />
                            </button>
                            <button className="action-btn">
                                <img src={assets.copy} alt="Copy" />
                            </button>
                            <button className="action-btn">
                                <img src={assets.like} alt="Like" />
                            </button>
                            <button className="action-btn">
                                <img src={assets.dislike} alt="Dislike" />
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="chat-footer">
                <div className="input-section">
                    <textarea
                        placeholder="Type your message here..."
                        value={input}
                        onChange={(e) => {
                            const textarea = e.target;
                            textarea.style.height = 'auto'; // Reset height
                            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`; // Adjust height within max-height
                            setInput(textarea.value); // Update state
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevent newline on Enter
                                handleSend(); // Send message
                            }
                        }}
                        className="textarea"
                    ></textarea>
                    <button className="mic-btn" onClick={handleVoiceInput}>
                        <img src={isListening ? assets.mic_active_icon : assets.mic_icon} alt="Mic" />
                    </button>
                    {input && (
                        <button className="send-btn" onClick={handleSend}>
                            <img src={assets.send_icon} alt="Send" />
                        </button>
                    )}
                </div>
                <p className="footer-note">Note: Responses may not always be accurate. Verify if needed.</p>
            </footer>
        </div>
    );
};

export default Main;
