import { useRef, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { api } from "../api";
import { BACKEND_BASE } from "../../config";

// Word-like toolbar: headings, bold/italic/underline/strike, colors,
// lists, alignment, quotes, links, images and a "clear formatting" button.
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
];

/**
 * value:    HTML string
 * onChange: (html: string) => void
 */
export default function RichTextEditor({ value, onChange, placeholder, height = 160 }) {
  const quillRef = useRef(null);

  // Uploads the picked image to the server and inserts the returned
  // absolute URL into the editor (so it renders on the public site too).
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;

      const range = editor.getSelection(true);
      const index = range ? range.index : editor.getLength();

      try {
        const { url } = await api.uploadImage(file);
        const src = url?.startsWith("http") ? url : `${BACKEND_BASE}${url}`;
        editor.insertEmbed(index, "image", src, "user");
        editor.setSelection(index + 1, 0, "user");
      } catch (e) {
        alert(e?.message || "Échec de l'envoi de l'image");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div style={{ marginBottom: 8 }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
      {/* spacer so the toolbar doesn't overlap the next field */}
      <div style={{ height: 42 }} />
    </div>
  );
}
