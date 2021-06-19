import { Component, createSignal, onMount } from "solid-js";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { debounce } from "../../utils/debounce";

interface IProps {
  options: any;
  onChange?: (e: any) => void;
}

const Editor: Component<IProps> = (props) => {
  let editor: any;
  const [view, setView] = createSignal<any>(null);

  onMount(() => {
    setView(
      new EditorView(editor, {
        state: EditorState.create(props.options || {}),
        handleTextInput: (e: any) => {
          props.onChange && debounce(() => props.onChange!(e));
          return false;
        },
      })
    );

    setTimeout(() => {
      view().focus();
    });
  });

  return <div ref={editor} className="editor" />;
};

export default Editor;
