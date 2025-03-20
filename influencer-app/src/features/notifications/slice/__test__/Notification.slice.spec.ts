import { describe, it, expect } from "vitest";
import reducer, {
  showNotification,
  hideNotification,
  NotificationState,
} from "../Notification.slice";

describe("Notification Slice", () => {
  describe("initial state", () => {
    it("should return the correct initial state", () => {
      const initialState = {
        isVisible: false,
        type: "info",
        title: "",
        message: "",
      };

      // @ts-expect-error - reducer called with undefined state and empty action
      expect(reducer(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  describe("actions", () => {
    it("should handle showNotification with all properties", () => {
      const initialState: NotificationState = {
        isVisible: false,
        type: "info",
        title: "",
        message: "",
      };

      const notification = {
        type: "success" as const,
        title: "Success Title",
        message: "Success Message",
      };

      const expectedState = {
        isVisible: true,
        type: "success",
        title: "Success Title",
        message: "Success Message",
      };

      expect(reducer(initialState, showNotification(notification))).toEqual(
        expectedState
      );
    });

    it("should handle showNotification without message", () => {
      const initialState: NotificationState = {
        isVisible: false,
        type: "info",
        title: "",
        message: "",
      };

      const notification = {
        type: "error" as const,
        title: "Error Title",
      };

      const expectedState = {
        isVisible: true,
        type: "error",
        title: "Error Title",
        message: undefined,
      };

      expect(reducer(initialState, showNotification(notification))).toEqual(
        expectedState
      );
    });

    it("should handle hideNotification", () => {
      const initialState: NotificationState = {
        isVisible: true,
        type: "success",
        title: "Test Title",
        message: "Test Message",
      };

      const expectedState = {
        isVisible: false,
        type: "success",
        title: "Test Title",
        message: "Test Message",
      };

      expect(reducer(initialState, hideNotification())).toEqual(expectedState);
    });
  });

  describe("state transitions", () => {
    it("should transition from success to error notification", () => {
      const successState: NotificationState = {
        isVisible: true,
        type: "success",
        title: "Success",
        message: "Operation succeeded",
      };

      const errorNotification = {
        type: "error" as const,
        title: "Error",
        message: "Operation failed",
      };

      const expectedState = {
        isVisible: true,
        type: "error",
        title: "Error",
        message: "Operation failed",
      };

      expect(
        reducer(successState, showNotification(errorNotification))
      ).toEqual(expectedState);
    });

    it("should transition from hidden to visible state", () => {
      const hiddenState: NotificationState = {
        isVisible: false,
        type: "info",
        title: "Old Title",
        message: "Old Message",
      };

      const newNotification = {
        type: "warning" as const,
        title: "Warning",
        message: "Watch out!",
      };

      const expectedState = {
        isVisible: true,
        type: "warning",
        title: "Warning",
        message: "Watch out!",
      };

      expect(reducer(hiddenState, showNotification(newNotification))).toEqual(
        expectedState
      );
    });

    it("should keep notification data after hiding", () => {
      const visibleState: NotificationState = {
        isVisible: true,
        type: "warning",
        title: "Warning Title",
        message: "Warning Message",
      };

      const expectedState = {
        isVisible: false,
        type: "warning",
        title: "Warning Title",
        message: "Warning Message",
      };

      expect(reducer(visibleState, hideNotification())).toEqual(expectedState);
    });
  });

  describe("type safety", () => {
    it("should handle all notification types correctly", () => {
      const types = ["success", "error", "info", "warning"] as const;

      types.forEach((type) => {
        const initialState: NotificationState = {
          isVisible: false,
          type: "info",
          title: "",
          message: "",
        };

        const notification = {
          type,
          title: `${type} Title`,
          message: `${type} Message`,
        };

        const expectedState = {
          isVisible: true,
          type,
          title: `${type} Title`,
          message: `${type} Message`,
        };

        expect(reducer(initialState, showNotification(notification))).toEqual(
          expectedState
        );
      });
    });
  });

  describe("action creators", () => {
    it("showNotification should create the correct action object", () => {
      const payload = {
        type: "success" as const,
        title: "Success Title",
        message: "Success Message",
      };

      const expectedAction = {
        type: "notification/showNotification",
        payload,
      };

      expect(showNotification(payload)).toEqual(expectedAction);
    });

    it("hideNotification should create the correct action object", () => {
      const expectedAction = {
        type: "notification/hideNotification",
      };

      expect(hideNotification()).toEqual(expectedAction);
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings in notification fields", () => {
      const initialState: NotificationState = {
        isVisible: false,
        type: "info",
        title: "",
        message: "",
      };

      const notification = {
        type: "success" as const,
        title: "",
        message: "",
      };

      const expectedState = {
        isVisible: true,
        type: "success",
        title: "",
        message: "",
      };

      expect(reducer(initialState, showNotification(notification))).toEqual(
        expectedState
      );
    });

    it("should handle showing notification when already visible", () => {
      const initialState: NotificationState = {
        isVisible: true,
        type: "info",
        title: "Old Info",
        message: "Old Message",
      };

      const notification = {
        type: "success" as const,
        title: "New Success",
        message: "New Message",
      };

      const expectedState = {
        isVisible: true,
        type: "success",
        title: "New Success",
        message: "New Message",
      };

      expect(reducer(initialState, showNotification(notification))).toEqual(
        expectedState
      );
    });

    it("should handle hiding notification when already hidden", () => {
      const initialState: NotificationState = {
        isVisible: false,
        type: "info",
        title: "Info Title",
        message: "Info Message",
      };

      expect(reducer(initialState, hideNotification())).toEqual(initialState);
    });
  });
});
