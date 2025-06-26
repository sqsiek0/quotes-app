import { act, renderHook } from "@testing-library/react-native";
import {
  StorageFavouritesProvider,
  useFavourites,
} from "../../hooks/useFavourites";
import { QuoteResponse } from "../../types/Quotes";
import AsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <StorageFavouritesProvider>{children}</StorageFavouritesProvider>
);

describe("useFavourites", () => {
  const quote: QuoteResponse = {
    id: 1,
    quote: "Test Quote",
    author: "Test Author",
  };

  test("initial state is empty", () => {
    const { result } = renderHook(() => useFavourites(), { wrapper });
    expect(result.current.state.ids).toEqual([]);
    expect(result.current.state.byId).toEqual({});
    expect(result.current.isFavourite(quote.id)).toBe(false);
  });

  test("adds quote when not present, and removes when present", async () => {
    const { result } = renderHook(() => useFavourites(), { wrapper });
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.toggle(quote);
    });

    expect(result.current.state.ids).toEqual([quote.id]);
    expect(result.current.state.byId[quote.id]).toEqual(quote);
    expect(result.current.isFavourite(quote.id)).toBe(true);

    act(() => {
      result.current.toggle(quote);
    });

    expect(result.current.state.ids).toEqual([]);
    expect(result.current.state.byId).toEqual({});
    expect(result.current.isFavourite(quote.id)).toBe(false);
  });

  test("hydrates state from AsyncStorage", async () => {
    const mockHydratedState = {
      ids: [quote.id],
      byId: { [quote.id]: quote },
    };

    jest
      .spyOn(AsyncStorage, "getItem")
      .mockResolvedValueOnce(JSON.stringify(mockHydratedState));

    const { result } = renderHook(() => useFavourites(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.state.ids).toEqual(mockHydratedState.ids);
    expect(result.current.state.byId).toEqual(mockHydratedState.byId);
  });

  test("uses storage without provider", async () => {
    expect(() => renderHook(() => useFavourites())).toThrow(
      "useFavourites must be used within a FavouritesProvider",
    );
  });
});
