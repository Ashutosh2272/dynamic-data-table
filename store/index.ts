import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tableReducer from './tableSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const rootReducer = combineReducers({ table: tableReducer });

const persistConfig = { key: 'root', storage, whitelist: ['table'] };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({ reducer: persistedReducer });
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
