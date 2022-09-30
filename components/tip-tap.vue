<template>
  <div>
    <client-only class="w-full">
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
        <editor-menu-icon :active="false" icon="code-view" description="Code block text" @click="editor.chain().focus().toggleCodeBlock().run()"/>
        <editor-menu-icon :active="false" icon="undo" description="Undo change" @click="editor.commands.undo()"/>

<editor-menu-icon :active="editor.isActive('redo')" icon="redo" description="Redo change" @click="editor.commands.redo()"/>
      </div>
        <editor-content :editor="editor" class="focus:outline-none  prose w-full max-w-full "/>
        

    </client-only>
  </div>
    
  
  </template>
  <script setup>
    import { useEditor, EditorContent } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Highlight from '@tiptap/extension-highlight'
    import Italic from '@tiptap/extension-italic'
    import Link from '@tiptap/extension-link'
    import Strike from '@tiptap/extension-strike'
    import Subscript from '@tiptap/extension-subscript'
    import Superscript from '@tiptap/extension-superscript'
    import Underline from '@tiptap/extension-underline'
    import CharacterCount from '@tiptap/extension-character-count'
    import { Color } from '@tiptap/extension-color'
    import TextStyle from '@tiptap/extension-text-style'
    import Dropcursor from '@tiptap/extension-dropcursor'
    import FontFamily from '@tiptap/extension-font-family'
    import Gapcursor from '@tiptap/extension-gapcursor'
    import Placeholder from '@tiptap/extension-placeholder'
    import TextAlign from '@tiptap/extension-text-align'

   // import TPHistory from '@tiptap/extension-history'

//TODO: implement font family extension
//TODO: implment color extension
    const editor = useEditor({
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit,
        Highlight,
        Italic,
        Strike,
        Subscript,
        Superscript,
        Underline,
        CharacterCount,
        FontFamily,
        TextStyle,
        Color,
        Dropcursor,
        Gapcursor,
        TextAlign,
        Placeholder,
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