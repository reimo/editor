import { createSignal, onMount, Show } from "solid-js";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
// @ts-ignore
import { addListNodes } from "prosemirror-schema-list";
import Editor from "./components/Editor";
import { setup } from "./components";
import Header from "./components/header";
import Sider from "./components/sider";
import { debounce } from "./utils/debounce";
import { CREATE_PAGE_MUTATION } from "./api/queries";
import https from "./utils/https";

const App = () => {
  let defaultContent: any = [];

  const [isSaved, setIsSaved] = createSignal(false),
    [isFailed, setIsFailed] = createSignal(false);

  const handleInputChange = (e: any) => {
    const [title, ...content]: any = e.state.doc.content.content;
    https({
      query: CREATE_PAGE_MUTATION,
      variables: {
        input: {
          content: JSON.stringify(content),
          slug: JSON.stringify(title),
          title: JSON.stringify(title),
          userId: 1,
        },
      },
    })
      .then(() => {
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      })
      .catch((err: any) => {
        setIsFailed(true);
        setTimeout(() => {
          setIsFailed(false);
        }, 2000);
      });
  };

  const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks,
  });

  const options: any = {
    doc: DOMParser.fromSchema(mySchema).parse(defaultContent),
    plugins: setup({ schema: mySchema }),
  };

  return (
    <div className="editor--wrapper">
      <Show when={isSaved()}>
        <div className="successMessage">Successfully saved the post!</div>
      </Show>
      <Show when={isFailed()}>
        <div className="errorMessage">Failed to save the post!</div>
      </Show>
      <Header />
      <Sider />
      <Editor options={options} onChange={handleInputChange} />
    </div>
  );
};

export default App;
