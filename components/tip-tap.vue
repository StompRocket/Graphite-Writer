<template>
  <div>
    <client-only>
      <div>
        <editor-menu-icon :active="editor.isActive('bold')" icon="bold" description="Bold text" @click="editor.chain().focus().toggleBold().run()"/>
        <editor-menu-icon :active="editor.isActive('italic')" icon="italic" description="Italic text" @click="editor.chain().focus().toggleItalic().run()"/>
        <editor-menu-icon :active="editor.isActive('link')" icon="link" activeIcon="link-unlink-m" description="Link text" @click="editor.chain().focus().toggleLink().run()"/>
        <editor-menu-icon :active="editor.isActive('highlight')" icon="heading" description="Highlight text" @click="editor.chain().focus().toggleHighlight().run()"/>
        <editor-menu-icon :active="editor.isActive('strike')" icon="strikethrough" description="Strikethrough text" @click="editor.chain().focus().toggleStrike().run()"/>
        <editor-menu-icon :active="editor.isActive('subscript')" icon="subscript" description="Subscript text" @click="editor.chain().focus().toggleSubscript().run()"/>
        <editor-menu-icon :active="editor.isActive('superscript')" icon="superscript" description="Superscript text" @click="editor.chain().focus().toggleSuperscript().run()"/>
        <editor-menu-icon :active="editor.isActive('underline')" icon="underline" description="Underline text" @click="editor.chain().focus().toggleUnderline().run()"/>
        <input
      type="color"
      @input="editor.chain().focus().setColor($event.target.value).run()"
      :value="editor.getAttributes('textStyle').color"
    >
    <editor-menu-icon :active="editor.isActive('bulletList')" icon="list-unordered" description="Bullet list text" @click="editor.chain().focus().toggleBulletList().run()"/>

    <editor-menu-icon :active="editor.isActive('blockquote')" icon="double-quotes-l" description="Block quote text" @click="editor.chain().focus().toggleBlockquote().run()"/>

        <editor-menu-icon :active="editor.isActive('codeBlock')" icon="code-view" description="Code block text" @click="editor.chain().focus().toggleCodeBlock().run()"/>

        <editor-menu-icon :active="false" icon="undo" description="Undo change" @click="editor.commands.undo()"/>

<editor-menu-icon :active="false" icon="redo" description="Redo change" @click="editor.commands.redo()"/>
      </div>
        <editor-content :editor="editor" class="focus:outline-none  prose w-full max-w-full "/>
        

    </client-only>
    

  </div>
    
  
  </template>
  <script setup>
    import { useEditor, EditorContent } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Highlight from '@tiptap/extension-highlight'
    import Link from '@tiptap/extension-link'
    import Subscript from '@tiptap/extension-subscript'
    import Superscript from '@tiptap/extension-superscript'
    import Underline from '@tiptap/extension-underline'
    import CharacterCount from '@tiptap/extension-character-count'
    import { Color } from '@tiptap/extension-color'
    import TextStyle from '@tiptap/extension-text-style'
    import FontFamily from '@tiptap/extension-font-family'
    import Typography from '@tiptap/extension-typography'
    import { lowlight } from 'lowlight/lib/common.js'
    import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
    
   // import Placeholder from '@tiptap/extension-placeholder'
    import TextAlign from '@tiptap/extension-text-align'
  
//TODO: implement font family extension
//TODO: implment color extension
//TODO: implement text align extension
//TODO: implement wordcount extension
    const editor = useEditor({
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
      extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
        Highlight,
         Subscript,
        Superscript,
        Underline,
        CharacterCount,
        FontFamily,
        TextStyle,
        Color,
        TextAlign,
        Typography,
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Link.configure({
  protocols: ['ftp', 'mailto'],
  HTMLAttributes: {
    class: 'text-blue-500',
  },
  openOnClick: false,
})
      ],
      beforeUnmount() {
    this.editor.destroy()
  },
    })
    </script>
      <style lang="css">
       
            code {
              color: inherit;
              padding: 0;
              background: none;
              font-size: 0.8rem;
            }
        
            .hljs-comment,
            .hljs-quote {
              color: #616161;
            }
        
            .hljs-variable,
            .hljs-template-variable,
            .hljs-attribute,
            .hljs-tag,
            .hljs-name,
            .hljs-regexp,
            .hljs-link,
            .hljs-name,
            .hljs-selector-id,
            .hljs-selector-class {
              color: #F98181;
            }
        
            .hljs-number,
            .hljs-meta,
            .hljs-built_in,
            .hljs-builtin-name,
            .hljs-literal,
            .hljs-type,
            .hljs-params {
              color: #FBBC88;
            }
        
            .hljs-string,
            .hljs-symbol,
            .hljs-bullet {
              color: #B9F18D;
            }
        
            .hljs-title,
            .hljs-section {
              color: #FAF594;
            }
        
            .hljs-keyword,
            .hljs-selector-tag {
              color: #70CFF8;
            }
        
            .hljs-emphasis {
              font-style: italic;
            }
        
            .hljs-strong {
              font-weight: 700;
            }
         
        </style>