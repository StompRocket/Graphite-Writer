<template>
        <client-only>
  <div class="relative w-full col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 xl:col-start-4 xl:col-span-6 ">

      <div class="flex items-center sticky sm:top-[6em] top-[11em] z-20 bg-white px-4 pt-2 rounded-t-md ">
        <editor-menu-icon
          :active="editor.isActive('bold')"
          icon="bold"
          description="Bold text"
          @click="editor.chain().focus().toggleBold().run()"
        />
        <editor-menu-icon
          :active="editor.isActive('italic')"
          icon="italic"
          description="Italic text"
          @click="editor.chain().focus().toggleItalic().run()"
        />
        <editor-menu-icon
          :active="editor.isActive('link')"
          icon="link"
          activeIcon="link-unlink-m"
          description="Link text"
          @click="editor.chain().focus().toggleLink().run()"
        />
        <editor-menu-icon
          :active="editor.isActive('highlight')"
          icon="heading"
          description="Highlight text"
          @click="editor.chain().focus().toggleHighlight().run()"
        />
        <editor-menu-icon
          :active="editor.isActive('strike')"
          icon="strikethrough"
          description="Strikethrough text"
          @click="editor.chain().focus().toggleStrike().run()"
        />
        <editor-menu-icon
          :active="editor.isActive('subscript')"
          icon="subscript"
          description="Subscript text"
          @click="editor.chain().focus().toggleSubscript().run()"
        />
        <editor-menu-icon
          :active="editor.isActive('superscript')"
          icon="superscript"
          description="Superscript text"
          @click="editor.chain().focus().toggleSuperscript().run()"
        />
        <editor-menu-icon
          :active="editor.isActive('underline')"
          icon="underline"
          description="Underline text"
          @click="editor.chain().focus().toggleUnderline().run()"
        />

        <div class="relative">
          <button :style="{'background-color': opacityTextColor}" class=" py-2 px-1 mr-1 rounded-sm hover:bg-gray-100 transition-colors duration-200 ease-out" @click="openColorPicker">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" ><path fill="none" d="M0 0h24v24H0z"/><path d="M15.246 14H8.754l-1.6 4H5l6-15h2l6 15h-2.154l-1.6-4zm-.8-2L12 5.885 9.554 12h4.892zM3 20h18v2H3v-2z" :fill="editor.getAttributes('textStyle').color ?? 'black'"/></svg>
          
          </button>
          <div v-if="colorPickerOpen" class="absolute z-30 drop-shadow-md w-[15em] rounded-md p-2 bg-white" v-click-outside="closeColorPicker" >
            
            <color-picker class="text-black" :color="color" @color-change="updateTextColor" :visible-formats="['rgb']" default-format="rgb" alpha-channel="hide" format-switch-button="false" copy-button="false"/>
          <button :style="{'background-color': updateColor}" class="gw-btn mt-2 w-full" @click="closeColorPicker">Set Color</button>  
          </div>
         
        </div>
     
        <editor-menu-icon
          :active="editor.isActive('bulletList')"
          icon="list-unordered"
          description="Bullet list text"
          @click="editor.chain().focus().toggleBulletList().run()"
        />

        <editor-menu-icon
          :active="editor.isActive('horizontalRule')"
          icon="separator"
          description="Insert a horizontal rule"
          @click="editor.chain().focus().setHorizontalRule().run()"
        />

        <editor-menu-icon
          :active="editor.isActive('blockquote')"
          icon="double-quotes-l"
          description="Block quote text"
          @click="editor.chain().focus().toggleBlockquote().run()"
        />

        <editor-menu-icon
          :active="editor.isActive('codeBlock')"
          icon="code-view"
          description="Code block text"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        />

        <editor-menu-icon
          :active="false"
          icon="undo"
          description="Undo change"
          @click="editor.commands.undo()"
        />

        <editor-menu-icon
          :active="false"
          icon="redo"
          description="Redo change"
          @click="editor.commands.redo()"
        />
      </div>
     
      <editor-content
        :editor="editor"
        class="focus:outline-none prose w-full max-w-full min-h-[80vh] bg-white rounded-b-md text-secondary px-4 pb-4 mt-0 pt-1"
        @click="editor.chain().focus().run()"
      />
  

  </div>
</client-only>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ColorPicker } from 'vue-accessible-color-picker'


import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Typography from "@tiptap/extension-typography";
import { lowlight } from "lowlight/lib/common.js";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from '@tiptap/extension-image'


// import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from '@tiptap/extension-placeholder';

let colorPickerOpen = ref(false)
let color = ref("")
let updateColor = ref("")


//TODO: implement font family extension
//TODO: implment color extension
//TODO: implement text align extension
//TODO: implement wordcount extension

//TODO: use tippy to create tooltips for the icons https://atomiks.github.io/tippyjs/v6/getting-started/

const editor = useEditor({
  content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
  extensions: [
    StarterKit.configure({
      codeBlock: false,
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
    Placeholder.configure({
      placeholder: 'Compose an epic...',
    }),
    Image.configure({
  allowBase64: true,
}),

    CodeBlockLowlight.configure({
      lowlight,
    }),
    Link.configure({
      protocols: ["ftp", "mailto"],
      HTMLAttributes: {
        class: "text-blue-500",
      },
      openOnClick: false,
    }),
  ],
  beforeUnmount() {
    this.editor.destroy();
  },
});

function openColorPicker() {
 // colorPickerOpen = true
 //color.value = editor.getAttributes('textStyle').color
 if (colorPickerOpen.value) {
    closeColorPicker()
    return
  } 
 color.value = editor.value.getAttributes('textStyle').color ?? '#000000'
 updateColor.value = color.value
  
  
    colorPickerOpen.value = !colorPickerOpen.value
  
  //console.log("open color picker", colorPickerOpen);
 
}
function updateTextColor(eventData) {
  updateColor.value = eventData.cssColor
  //editor.value.chain().focus().setColor(eventData.cssColor).run()
 // colorPickerOpen.value = false
}
function closeColorPicker() {
  editor.value.chain().focus().setColor(updateColor.value).run()
  colorPickerOpen.value = false
  console.log(editor.value.getAttributes('textStyle'), opacityTextColor.value)
}

const opacityTextColor = computed(() => {
  let str = editor.value.getAttributes('textStyle').color
  if (str) {
    str = str.slice(0, 3) + "a" + str.slice(3);
    str = str.slice(0, str.length -1) + ", 0.5" + str.slice(str.length -1);
    console.log(str)
  return str
  } else {
    return 'white'
  }
  
})

</script>

<style lang="css">
  .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
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
  color: #f98181;
}

.hljs-number,
.hljs-meta,
.hljs-built_in,
.hljs-builtin-name,
.hljs-literal,
.hljs-type,
.hljs-params {
  color: #fbbc88;
}

.hljs-string,
.hljs-symbol,
.hljs-bullet {
  color: #b9f18d;
}

.hljs-title,
.hljs-section {
  color: #faf594;
}

.hljs-keyword,
.hljs-selector-tag {
  color: #70cff8;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: 700;
}

</style>
