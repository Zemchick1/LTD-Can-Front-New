import { Router } from './components/Router/Router';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from './store';
import { CookieConsent } from './components/CookieConsent/CookieConsent';
import { useCookies } from "react-cookie"

function App() {
  const [cookies] = useCookies(["cookieConsent"]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router />
        {!cookies.cookieConsent && < CookieConsent />}
      </PersistGate>
    </Provider>
  );
}

export default App;
