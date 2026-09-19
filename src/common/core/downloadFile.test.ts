import { todayStamp } from "./downloadFile";

describe("todayStamp", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("given any locale, when called, then the date is formatted as year-month-day so filenames sort and contain no slashes", () => {
    // Arrange
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 9, 12));

    // Act
    const stamp = todayStamp();

    // Assert
    expect(stamp).toBe("2026-09-09");
  });

  it("given it is just after midnight local time, when called, then the local date is used rather than UTC", () => {
    // Arrange
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 9, 0, 30));

    // Act
    const stamp = todayStamp();

    // Assert
    expect(stamp).toBe("2026-09-09");
  });
});
