import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../assets/assets';
import { Context } from '../../../context/context';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

    const handlePromptClick = (prompt) => {
        setRecentPrompt(prompt);
        onSent(prompt);
    };

    return (
        <aside className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
            <div className="sidebar-header">
                <button onClick={() => setIsExpanded(!isExpanded)} className="menu-toggle">
                    <img src={assets.menu_icon} alt="Menu" />
                </button>
                <div className="new-chat-btn" onClick={newChat}>
                    <img src={assets.plus_icon} alt="New Chat" />
                    {isExpanded && <span>New Chat</span>}
                </div>
            </div>
            {isExpanded && (
                <div className="recent-chats">
                    <h3>Recent Chats</h3>
                    {prevPrompts.slice().reverse().map((prompt, idx) => (
                        <div
                            key={idx}
                            className="chat-item"
                            onClick={() => handlePromptClick(prompt)}
                        >
                            <img src={assets.message_icon} alt="Message" />
                            <span>{prompt.slice(0, 25)}...</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="sidebar-footer">
                <div className="sidebar-option">
                    <img src={assets.history_icon} alt="History" />
                    {isExpanded && <span>Log Out</span>}
                </div>
                <div className="sidebar-option">
                    <img src={assets.setting_icon} alt="Settings" />
                    {isExpanded && <span>Settings</span>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
