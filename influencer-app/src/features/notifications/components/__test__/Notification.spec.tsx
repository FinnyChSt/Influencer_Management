import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import NotificationToast from "../NotificationToast";
import notificationReducer, {
  showNotification,
  hideNotification,
} from "../../slice/Notification.slice";

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      notification: notificationReducer,
    },
    preloadedState: initialState,
  });
};

describe("NotificationToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it("should not render when notification is not visible", () => {
    const store = createTestStore({
      notification: {
        isVisible: false,
        type: "info",
        title: "Test Title",
        message: "Test Message",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
  });

  it("should render success notification correctly", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "success",
        title: "Success!",
        message: "Operation completed successfully",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    const titleElement = screen.getByText("Success!");
    const messageElement = screen.getByText("Operation completed successfully");
    const notificationContainer = titleElement.closest(
      'div[class*="bg-green-50"]'
    );

    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-green-600");
    expect(messageElement).toBeInTheDocument();
    expect(notificationContainer).toBeInTheDocument();
  });

  it("should render error notification correctly", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "error",
        title: "Error!",
        message: "Something went wrong",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    const titleElement = screen.getByText("Error!");
    const messageElement = screen.getByText("Something went wrong");
    const notificationContainer = titleElement.closest(
      'div[class*="bg-red-50"]'
    );

    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-red-600");
    expect(messageElement).toBeInTheDocument();
    expect(notificationContainer).toBeInTheDocument();
  });

  it("should render warning notification correctly", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "warning",
        title: "Warning!",
        message: "Proceed with caution",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    const titleElement = screen.getByText("Warning!");
    const messageElement = screen.getByText("Proceed with caution");
    const notificationContainer = titleElement.closest(
      'div[class*="bg-yellow-50"]'
    );

    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-yellow-600");
    expect(messageElement).toBeInTheDocument();
    expect(notificationContainer).toBeInTheDocument();
  });

  it("should render info notification as default", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "info",
        title: "Info",
        message: "For your information",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    const titleElement = screen.getByText("Info");
    const messageElement = screen.getByText("For your information");
    const notificationContainer = titleElement.closest(
      'div[class*="bg-blue-50"]'
    );

    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-blue-600");
    expect(messageElement).toBeInTheDocument();
    expect(notificationContainer).toBeInTheDocument();
  });

  it("should close notification when close button is clicked", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "success",
        title: "Success!",
        message: "Operation completed successfully",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    const closeButton = screen.getByLabelText("Close notification");
    fireEvent.click(closeButton);
    expect(store.getState().notification.isVisible).toBe(false);
  });

  it("should auto-close notification after 5 seconds", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "success",
        title: "Success!",
        message: "Operation completed successfully",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    expect(screen.getByText("Success!")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(store.getState().notification.isVisible).toBe(false);
  });

  it("should cancel auto-close timer if notification is hidden", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "success",
        title: "Success!",
        message: "Operation completed successfully",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    expect(screen.getByText("Success!")).toBeInTheDocument();
    store.dispatch(hideNotification());
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    store.dispatch(
      showNotification({
        type: "error",
        title: "Error!",
        message: "New error message",
      })
    );
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(store.getState().notification.isVisible).toBe(true);
  });

  it("should have the proper z-index to appear above modals", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "info",
        title: "Info",
        message: "For your information",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    const notificationContainer = screen.getByText("Info").closest(".fixed");
    expect(notificationContainer).toHaveClass("z-[1000]");
  });

  it("should be properly positioned at the bottom center of the screen", () => {
    const store = createTestStore({
      notification: {
        isVisible: true,
        type: "info",
        title: "Info",
        message: "For your information",
      },
    });

    render(
      <Provider store={store}>
        <NotificationToast />
      </Provider>
    );

    const notificationContainer = screen.getByText("Info").closest(".fixed");
    expect(notificationContainer).toHaveClass("bottom-4");
    expect(notificationContainer).toHaveClass("left-1/2");
    expect(notificationContainer).toHaveClass("transform");
    expect(notificationContainer).toHaveClass("-translate-x-1/2");
  });
});
