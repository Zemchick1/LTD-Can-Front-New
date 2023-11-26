import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import { writingsReducer } from "./writings/reducer";
import { profileReducer } from "./profile/reducer";
import { helperReducer } from "./helper/reducer";
import { filterReducer } from "./filter/reducer";

const persistConfig = {
    key: "ltd",
    storage,
    blacklist: ["writings", "helper", "filter"]
}

const rootReducer = combineReducers({
    writings: writingsReducer,
    profile: profileReducer,
    helper: helperReducer,
    filter: filterReducer
})

export const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
    persistConfig,
    rootReducer
)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    })
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppStore = typeof store