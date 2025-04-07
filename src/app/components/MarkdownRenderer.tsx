"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      table: ({ children }) => (
        <table className="table-auto border-collapse border border-gray-300 w-full text-sm mb-4">
          {children}
        </table>
      ),
      thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
      tbody: ({ children }) => <tbody>{children}</tbody>,
      tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
      th: ({ children }) => (
        <th className="px-4 py-2 border border-gray-300 font-medium">{children}</th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-2 border border-gray-300">{children}</td>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

export default MarkdownRenderer;
