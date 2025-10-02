import { Provider } from "react-redux";
import { ClientRouter } from "./router/Router";
import store from "store/store";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "components/shared";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ClientRouter />
      </ThemeProvider>

      <Toaster
        toastOptions={{
          success: {
            className:
              "text-theme900 text-xs font-semibold  bg-theme100 w-auto",
            position: "bottom-right",
            duration: 4000,
          },
          error: {
            className: "text-red-900 text-xs font-semibold  bg-red-100 w-auto",
            position: "bottom-right",
            duration: 4000,
          },
        }}
      />
    </Provider>
  );
}

export default App;
