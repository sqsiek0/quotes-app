import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { QuoteResponse } from "../types/Quotes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@favourites";

interface FavouritiesContextType {
  ids: number[];
  byId: Record<number, QuoteResponse>;
}

type Action =
  | { type: "hydrate"; payload: FavouritiesContextType }
  | { type: "toggle"; payload: QuoteResponse };

function reducer(
  state: FavouritiesContextType,
  action: Action,
): FavouritiesContextType {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "toggle":
      const id = action.payload.id;
      const exists = state.byId[id];
      if (exists) {
        const { [id]: _, ...rest } = state.byId;
        return { ids: state.ids.filter((i) => i !== id), byId: rest };
      }
      return {
        ids: [id, ...state.ids],
        byId: { ...state.byId, [id]: action.payload },
      };
  }
}

const FavsContext = createContext<{
  state: FavouritiesContextType;
  toggle: (quote: QuoteResponse) => void;
  isFavourite: (id: number) => boolean;
} | null>(null);

export function StorageFavouritesProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, {
    ids: [],
    byId: {},
  });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) dispatch({ type: "hydrate", payload: JSON.parse(json) });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggle = (quote: QuoteResponse) => {
    dispatch({ type: "toggle", payload: quote });
  };
  const isFavourite = (id: number) => !!state.byId[id];

  return (
    <FavsContext.Provider
      value={{
        state,
        toggle: toggle,
        isFavourite: isFavourite,
      }}
    >
      {children}
    </FavsContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavsContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
}
