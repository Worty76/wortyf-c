import React from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const BotRedirect = ({ url, message }) => {
  return (
    <div>
      <a href={url} target="_blank" rel="noreferrer">
        {message}
      </a>
    </div>
  );
};

const CHATBOT_THEME = {
  background: "#FFFEFC",
  fontFamily: "Roboto",
  headerBgColor: "#24292F",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#C8D7C2",
  botFontColor: "#fff",
  userBubbleColor: "#24292F",
  userFontColor: "#fff"
};

const ChatBotHelper = () => {

  const steps = [
    {
      id: "1",
      message: "Hello!",
      trigger: "2"
    },
    {
      id: "2",
      message: "How can I help you?",
      trigger: "3"
    },
    {
      id: "3",
      options: [
        { value: 1, label: "How to create a post", trigger: "4" },
        { value: 2, label: "Show ChatBot API", trigger: "5" }
      ]
    },
    {
      id: "4",
      component: (
        <BotRedirect
          message="Here's how to create a post"
          url="<https://lucasbassetti.com.br/react-simple-chatbot/#/docs/previous-value>"
        />
      ),
      trigger: "2"
    },
    {
      id: "5",
      component: (
        <BotRedirect
          message="See chatbot API here"
          url="<https://lucasbassetti.com.br/react-simple-chatbot/#/docs/chatbot>"
        />
      ),
      trigger: "2"
    }
  ];

  return (
      <ThemeProvider theme={CHATBOT_THEME}>
        <ChatBot steps={steps} floating={true} />
      </ThemeProvider>
  );
};

export default ChatBotHelper;