import React from "react";
import Sidebar from "../sidebar/sidebar";
import Main from "../Main/Main";
// import "./ChatPage.css"; // Optional for layout styling

function ChatPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Main />
    </div>
  );
}

export default ChatPage;