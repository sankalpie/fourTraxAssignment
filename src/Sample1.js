import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';
import './styles.css'; 

const EmojiExtension = Extension.create({
  name: 'emoji',

  addCommands() {
    return {
      insertEmoji: (emoji) => ({ commands }) => {
        return commands.insertContent(emoji);
      },
    };
  },
});

const RichTextEditor = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit, EmojiExtension],
    content: '<p>This is a sample for creating a custom Emoji Extension using TipTap in ReactJS for FourTrax!<br>I really hope I get selected!! <br> Click here to edit this text and see an example!!!</p>',
  });

  /* These emojiPicker and emojiButtonRefs are only for closing out of the emoji-picker once we click on the button again or click outside */
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  if (!editor) return null;

  const emojis = ['😀', '😂', '😍', '👍', '🎉', '😅'];

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button
          ref={emojiButtonRef}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          Emoji
        </button>
      </div>
      {showEmojiPicker && (
        <div className="emoji-picker" ref={emojiPickerRef}>
          {emojis.map((emoji) => (
            <button key={emoji} onClick={() => editor.chain().focus().insertEmoji(emoji).run()}>
              {emoji}
            </button>
          ))}
        </div>
      )}
      <br />
      <br />
      <EditorContent editor={editor} className="editor" />
    </div>
  );
};

export default RichTextEditor;