import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Word-like toolbar: headings, bold/italic/underline/strike, colors,
// lists, alignment, links, and a "clear formatting" button.
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

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
  "link",
];

/**
 * value:    HTML string
 * onChange: (html: string) => void
 */
export default function RichTextEditor({ value, onChange, placeholder, height = 160 }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <ReactQuill
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