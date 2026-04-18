"use client";

import { CustomerServiceOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function FloatingChatWidget({ contact }) {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    {
      key: "zalo",
      label: "Chat Zalo",
      url: contact?.zaloUrl || "",
      icon: "/static/icons/zalo.png",
    },
    {
      key: "messenger",
      label: "Chat Messenger",
      url: contact?.messengerUrl || "",
      icon: "/static/icons/messenger.png",
    },
  ].filter((item) => Boolean(item.url));

  if (!channels.length) {
    return null;
  }

  return (
    <div className="floating-chat" aria-label="Liên hệ nhanh">
      <div className="floating-chat-desktop">
        {channels.map((channel) => (
          <a
            key={channel.key}
            href={channel.url}
            target="_blank"
            rel="noreferrer"
            className="floating-chat-link"
            aria-label={channel.label}
          >
            <span className="floating-chat-icon-wrap">
              <img src={channel.icon} alt={channel.label} />
            </span>
          </a>
        ))}
      </div>

      <div className="floating-chat-mobile">
        <div className={`floating-chat-mobile-list ${isOpen ? "open" : ""}`}>
          {channels.map((channel) => (
            <a
              key={channel.key}
              href={channel.url}
              target="_blank"
              rel="noreferrer"
              className="floating-chat-link"
              aria-label={channel.label}
              onClick={() => setIsOpen(false)}
            >
              <span className="floating-chat-icon-wrap">
                <img src={channel.icon} alt={channel.label} />
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          className="floating-chat-toggle"
          aria-label={isOpen ? "Đóng hỗ trợ trực tuyến" : "Mở hỗ trợ trực tuyến"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          <CustomerServiceOutlined />
        </button>
      </div>
    </div>
  );
}
