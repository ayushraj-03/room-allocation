package com.collegeroom.allocationsystem.service;

import com.collegeroom.allocationsystem.model.Booking;
import com.collegeroom.allocationsystem.model.BookingStatus;
import com.collegeroom.allocationsystem.model.Room;
import com.collegeroom.allocationsystem.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingConflictServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    private BookingConflictService conflictService;

    private final Long roomId = 1L;
    private final LocalDate testDate = LocalDate.of(2026, 10, 15);

    @BeforeEach
    void setUp() {
        conflictService = new BookingConflictService(bookingRepository);
    }

    private Booking createBooking(Long id, LocalTime start, LocalTime end, BookingStatus status) {
        Booking b = new Booking();
        b.setId(id);
        Room r = new Room();
        r.setId(roomId);
        b.setRoom(r);
        b.setDate(testDate);
        b.setStartTime(start);
        b.setEndTime(end);
        b.setStatus(status);
        return b;
    }

    @Test
    @DisplayName("TC-01: Distinct non-overlapping timeslots should be ALLOWED")
    void testNonOverlappingSlotsAllowed() {
        Booking existing = createBooking(10L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.APPROVED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(existing));

        boolean conflict = conflictService.hasConflict(roomId, testDate, LocalTime.of(14, 0), LocalTime.of(16, 0));
        assertFalse(conflict, "Expected no conflict for distinct timeslots");
    }

    @Test
    @DisplayName("TC-02: Identical timeslot on same date should CONFLICT")
    void testIdenticalSlotConflicts() {
        Booking existing = createBooking(10L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.APPROVED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(existing));

        boolean conflict = conflictService.hasConflict(roomId, testDate, LocalTime.of(10, 0), LocalTime.of(12, 0));
        assertTrue(conflict, "Expected conflict for identical timeslot");
    }

    @Test
    @DisplayName("TC-03: Requested end time intrudes into existing booking should CONFLICT")
    void testEndIntrusionConflicts() {
        Booking existing = createBooking(10L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.APPROVED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(existing));

        boolean conflict = conflictService.hasConflict(roomId, testDate, LocalTime.of(9, 0), LocalTime.of(10, 30));
        assertTrue(conflict, "Expected conflict when end time overlaps existing start");
    }

    @Test
    @DisplayName("TC-04: Requested start time intrudes into existing booking should CONFLICT")
    void testStartIntrusionConflicts() {
        Booking existing = createBooking(10L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.APPROVED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(existing));

        boolean conflict = conflictService.hasConflict(roomId, testDate, LocalTime.of(11, 30), LocalTime.of(13, 0));
        assertTrue(conflict, "Expected conflict when start time overlaps existing end");
    }

    @Test
    @DisplayName("TC-05: Requested slot completely encloses existing booking should CONFLICT")
    void testEnclosingSlotConflicts() {
        Booking existing = createBooking(10L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.APPROVED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(existing));

        boolean conflict = conflictService.hasConflict(roomId, testDate, LocalTime.of(9, 0), LocalTime.of(13, 0));
        assertTrue(conflict, "Expected conflict when enclosing existing booking");
    }

    @Test
    @DisplayName("TC-07: Adjacent back-to-back slots should be ALLOWED")
    void testAdjacentSlotsAllowed() {
        Booking existing = createBooking(10L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.APPROVED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(existing));

        // Slot immediately following: 12:00 to 14:00
        boolean conflictAfter = conflictService.hasConflict(roomId, testDate, LocalTime.of(12, 0), LocalTime.of(14, 0));
        assertFalse(conflictAfter, "Adjacent slot immediately after should be allowed");

        // Slot immediately prior: 08:00 to 10:00
        boolean conflictBefore = conflictService.hasConflict(roomId, testDate, LocalTime.of(8, 0), LocalTime.of(10, 0));
        assertFalse(conflictBefore, "Adjacent slot immediately before should be allowed");
    }

    @Test
    @DisplayName("TC-09: Overlapping slot with a REJECTED booking should be ALLOWED")
    void testRejectedBookingDoesNotBlock() {
        Booking rejected = createBooking(10L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.REJECTED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(rejected));

        boolean conflict = conflictService.hasConflict(roomId, testDate, LocalTime.of(10, 0), LocalTime.of(12, 0));
        assertFalse(conflict, "Rejected booking must not block room");
    }

    @Test
    @DisplayName("TC-10: Exclude existing booking ID during update should be ALLOWED")
    void testExcludeBookingIdAllowed() {
        Booking self = createBooking(42L, LocalTime.of(10, 0), LocalTime.of(12, 0), BookingStatus.APPROVED);
        when(bookingRepository.findByRoomIdAndDate(roomId, testDate)).thenReturn(List.of(self));

        boolean conflict = conflictService.hasConflict(roomId, testDate, LocalTime.of(10, 0), LocalTime.of(12, 0), 42L);
        assertFalse(conflict, "Booking should not conflict with itself when excluding its own ID");
    }
}
