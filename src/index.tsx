import { render } from "solid-js/web";
import { ThemeProvider } from "solid-styled-components";
import { themes } from "./utils/themeConfig";
import App from './App'
import Wrapper from './globalStyles';

render(
  () => (
    <ThemeProvider theme={themes.default}>
      <Wrapper />
      <App />
    </ThemeProvider>
  ),
  document.getElementById("root") as any
);
