jest.mock("../../../hooks/useFavourites", () => ({
  StorageFavouritesProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useFavourites: jest.fn(() => ({
    state: { ids: [], byId: {} },
    toggle: jest.fn(),
    isFavourite: jest.fn(() => false),
  })),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "../../../hooks/useTheme";
import Favourites from "../../../app/(tabs)/Favourite";
import { useFavourites } from "../../../hooks/useFavourites";

const wrapper = ({ children }: PropsWithChildren) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

describe("Favourite screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", async () => {
    const { getByTestId } = render(<Favourites />, { wrapper });
    const favouriteScreen = getByTestId("favourites-screen");
    expect(favouriteScreen).toBeTruthy();
  });

  test("shows empty message when no favourites", async () => {
    const { getByText } = render(<Favourites />, { wrapper });
    const emptyMessage = getByText("No favourites yet.");
    expect(emptyMessage).toBeTruthy();
  });

  describe("when favourites are present", () => {
    const mockFavourites = {
      state: {
        ids: [1, 2],
        byId: {
          1: { id: 1, quote: "Quote 1", author: "Author 1" },
          2: { id: 2, quote: "Quote 2", author: "Author 2" },
        },
      },
      toggle: jest.fn(),
      isFavourite: jest.fn(() => true),
    };

    test("renders favourite quotes when available", async () => {
      jest.mocked(useFavourites).mockReturnValueOnce(mockFavourites);

      const { getByText } = render(<Favourites />, { wrapper });
      expect(getByText("Quote 1")).toBeTruthy();
      expect(getByText(`- Author 1`)).toBeTruthy();
      expect(getByText("Quote 2")).toBeTruthy();
      expect(getByText(`- Author 2`)).toBeTruthy();
    });

    test("open modal on quote press", async () => {
      jest.mocked(useFavourites).mockReturnValueOnce(mockFavourites);

      const { getByText, getByTestId } = render(<Favourites />, { wrapper });
      const quoteCard = getByText("Quote 1");
      fireEvent.press(quoteCard);

      const modal = getByTestId("favourite-modal");
      expect(modal).toBeTruthy();
    });

    test("modal shows correct quote details and buttons", async () => {
      jest.mocked(useFavourites).mockReturnValueOnce(mockFavourites);

      const { getByText, getByTestId } = render(<Favourites />, { wrapper });
      const quoteCard = getByText("Quote 1");
      fireEvent.press(quoteCard);

      waitFor(() => {
        const modal = getByTestId("favourite-modal");
        expect(modal).toBeTruthy();
        expect(getByTestId("favourite-modal-quote")).toBeTruthy();
        expect(getByText(`favourite-modal-author`)).toBeTruthy();
        expect(getByText("Remove from favourites")).toBeTruthy();
        expect(getByText("Close")).toBeTruthy();
      });
    });

    test('calls close modal on "Close" button press', async () => {
      jest.mocked(useFavourites).mockReturnValueOnce(mockFavourites);

      const { getByText, getByTestId } = render(<Favourites />, { wrapper });
      const quoteCard = getByText("Quote 1");
      fireEvent.press(quoteCard);

      const closeButton = getByText("Close");
      fireEvent.press(closeButton);

      waitFor(() => {
        const modal = getByTestId("favourite-modal");
        expect(modal).toBeFalsy();
      });
    });

    test('calls toggle on "Remove from favourites" button press', async () => {
      jest.mocked(useFavourites).mockReturnValueOnce(mockFavourites);

      const { getByText } = render(<Favourites />, { wrapper });
      const quoteCard = getByText("Quote 1");
      fireEvent.press(quoteCard);

      const removeButton = getByText("Remove from favourites");
      fireEvent.press(removeButton);

      waitFor(() => {
        expect(mockFavourites.toggle).toHaveBeenCalledWith(
          mockFavourites.state.byId[1]
        );
      });
    });

    test("close modal on back button press", async () => {
      jest.mocked(useFavourites).mockReturnValueOnce(mockFavourites);

      const { getByText, getByTestId } = render(<Favourites />, { wrapper });
      const quoteCard = getByText("Quote 1");
      fireEvent.press(quoteCard);

      const modal = getByTestId("favourite-modal");
      expect(modal).toBeTruthy();

      fireEvent(modal, "requestClose");

      waitFor(() => {
        expect(modal).toBeFalsy();
      });
    });
  });
});
