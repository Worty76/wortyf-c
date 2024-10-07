import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import auth from "../../../helpers/Auth";

export default function TextEditor({ placeholder, setText }) {
  const TINY_MCE_API_KEY = process.env.REACT_APP_API_KEY_RTE;
  const editorRef = useRef(null);

  function log() {
    const content = editorRef.current.getContent();
    setText(content);
  }

  return (
    <>
      <Editor
        apiKey={TINY_MCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        disabled={auth.isAuthenticated() ? false : true}
        onEditorChange={log}
        init={{
          placeholder: placeholder,
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Roboto,Helvetica,Arial,sans-serif; font-size:16px; line-height: 1; }",
        }}
      />
    </>
  );
}
