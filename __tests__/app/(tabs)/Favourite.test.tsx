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
import Favourites from "../../../app/(tabs)/Favourite";
import { useFavourites } from "../../../hooks/useFavourites";
import { ThemeProvider } from "../../../hooks/useTheme";

const wrapper = ({ children }: PropsWithChildren) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

describe("Favourite screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
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
    const mockedToggle = jest.fn();
    const mockFavourites = {
      state: {
        ids: [1, 2],
        byId: {
          1: { id: 1, quote: "Quote 1", author: "Author 1" },
          2: { id: 2, quote: "Quote 2", author: "Author 2" },
        },
      },
      toggle: mockedToggle,
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

      await waitFor(() => {
        const modal = getByTestId("favourite-modal");
        expect(modal).toBeTruthy();
        expect(getByTestId("favourite-modal-quote")).toBeTruthy();
        expect(getByTestId(`favourite-modal-author`)).toBeTruthy();
        expect(getByText("Remove from favourites")).toBeTruthy();
        expect(getByText("Close")).toBeTruthy();
      });
    });

    test('calls close modal on "Close" button press', async () => {
      jest.mocked(useFavourites).mockReturnValueOnce(mockFavourites);

      const { getByText, queryByTestId } = render(<Favourites />, {
        wrapper,
      });
      const quoteCard = getByText("Quote 1");
      fireEvent.press(quoteCard);

      const closeButton = getByText("Close");
      fireEvent.press(closeButton);

      await waitFor(() => {
        expect(queryByTestId("favourite-modal")).toBeFalsy();
      });
    });

    test('calls toggle on "Remove from favourites" button press', async () => {
      jest.mocked(useFavourites).mockReturnValue(mockFavourites);

      const { getByText, getByTestId } = render(<Favourites />, { wrapper });

      fireEvent.press(getByText("Quote 1"));

      expect(getByTestId("favourite-modal")).toBeTruthy();

      const removeBtn = getByText("Remove from favourites");
      expect(removeBtn).toBeTruthy();

      waitFor(() => {
        fireEvent.press(removeBtn);
      });

      expect(mockedToggle).toHaveBeenCalled();
    });

    test("close modal on back button press", async () => {
      jest.mocked(useFavourites).mockReturnValue(mockFavourites);

      const { getByText, getByTestId, queryByTestId } = render(<Favourites />, {
        wrapper,
      });
      const quoteCard = getByText("Quote 1");
      fireEvent.press(quoteCard);

      const modal = getByTestId("favourite-modal");
      expect(modal).toBeTruthy();

      fireEvent(modal, "requestClose");

      await waitFor(() => {
        expect(queryByTestId("favourite-modal")).toBeFalsy();
      });
    });
  });
});
